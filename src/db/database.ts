import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('music.db');

export function initDatabase() {
    db.execSync(`PRAGMA foreign_keys = ON;`);

    db.execSync(`
        CREATE TABLE IF NOT EXISTS songs (
            id TEXT PRIMARY KEY NOT NULL,
            filename TEXT NOT NULL,
            uri TEXT NOT NULL,
            folder_name TEXT NOT NULL,
            folder_path TEXT NOT NULL,
            duration REAL DEFAULT 0,
            album_id TEXT,
            creation_time INTEGER DEFAULT 0,
            modification_time INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS folders (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            path TEXT NOT NULL,
            songs INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS queues (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            is_active INTEGER DEFAULT 0,
            created_at INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS queue_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            queue_id INTEGER NOT NULL,
            song_id TEXT NOT NULL,
            position INTEGER NOT NULL,
            FOREIGN KEY (queue_id) REFERENCES queues (id) ON DELETE CASCADE,
            FOREIGN KEY (song_id) REFERENCES songs (id) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_songs_folder ON songs(folder_path);
        CREATE INDEX IF NOT EXISTS idx_queue_items_pos ON queue_items(queue_id, position);
    `);
}

export function getDatabase() {
    return db;
}

export function hasMusicData() {
    const result = db.getFirstSync<{ count: number }>(
        `SELECT COUNT(*) as count FROM songs`
    );

    return (result?.count ?? 0) > 0;
}

// ================= QUEUE OPERATIONS =================

export interface QueueItem {
    queue_item_id: number;
    queue_id: number;
    position: number;
    id: string;
    filename: string;
    uri: string;
    duration: number;
}

export interface QueueMeta {
    id: number;
    name: string;
    is_active: number;
    created_at: number;
}

// Create a new queue without deleting existing queues. 
// Updates or inserts based on the name, and marks it as active.
export function createQueue(queueName: string, songIds: string[]) {
    db.withTransactionSync(() => {
        // Unset previous active queue
        db.execSync(`UPDATE queues SET is_active = 0;`);

        // Check if queue with the same name already exists
        const existing = db.getFirstSync<{ id: number }>(
            `SELECT id FROM queues WHERE name = ?;`,
            [queueName]
        );

        let queueId: number;

        if (existing) {
            queueId = existing.id;
            // Update existing queue status & clear old items
            db.runSync(
                `UPDATE queues SET is_active = 1, created_at = ? WHERE id = ?;`,
                [Date.now(), queueId]
            );
            db.runSync(`DELETE FROM queue_items WHERE queue_id = ?;`, [queueId]);
        } else {
            // Insert brand new queue
            const result = db.runSync(
                `INSERT INTO queues (name, is_active, created_at) VALUES (?, 1, ?);`,
                [queueName, Date.now()]
            );
            queueId = result.lastInsertRowId;
        }

        // Insert new track order for this queue
        const statement = db.prepareSync(
            `INSERT INTO queue_items (queue_id, song_id, position) VALUES (?, ?, ?);`
        );

        try {
            songIds.forEach((songId, index) => {
                statement.executeSync([queueId, songId, index]);
            });
        } finally {
            statement.finalizeSync();
        }
    });
}

export function setQueue(songIds: string[]) {
    createQueue('Default Queue', songIds);
}

// Switch current active queue by queue ID
export function setActiveQueue(queueId: number) {
    db.withTransactionSync(() => {
        db.execSync(`UPDATE queues SET is_active = 0;`);
        db.runSync(`UPDATE queues SET is_active = 1 WHERE id = ?;`, [queueId]);
    });
}

// Get all saved queues for selection later
export function getAllQueues(): QueueMeta[] {
    return db.getAllSync<QueueMeta>(
        `SELECT * FROM queues ORDER BY created_at DESC;`
    );
}

// Get active queue name
export function getQueueName(): string {
    const result = db.getFirstSync<{ name: string }>(
        `SELECT name FROM queues WHERE is_active = 1;`
    );
    return result?.name ?? 'Queue';
}

// Fetch tracks for currently active queue
export function getQueue(): QueueItem[] {
    return db.getAllSync<QueueItem>(`
        SELECT 
            qi.id as queue_item_id,
            qi.queue_id,
            qi.position,
            s.*
        FROM queue_items qi
        JOIN queues q ON qi.queue_id = q.id
        JOIN songs s ON qi.song_id = s.id
        WHERE q.is_active = 1
        ORDER BY qi.position ASC;
    `);
}

// Fetch tracks for a specific queue ID
export function getQueueById(queueId: number): QueueItem[] {
    return db.getAllSync<QueueItem>(`
        SELECT 
            qi.id as queue_item_id,
            qi.queue_id,
            qi.position,
            s.*
        FROM queue_items qi
        JOIN songs s ON qi.song_id = s.id
        WHERE qi.queue_id = ?
        ORDER BY qi.position ASC;
    `, [queueId]);
}

// Append a track to the current active queue
export function addToQueue(songId: string) {
    const activeQueue = db.getFirstSync<{ id: number }>(
        `SELECT id FROM queues WHERE is_active = 1;`
    );

    if (!activeQueue) return;

    const maxPosResult = db.getFirstSync<{ max_pos: number | null }>(
        `SELECT MAX(position) as max_pos FROM queue_items WHERE queue_id = ?;`,
        [activeQueue.id]
    );
    const nextPosition = (maxPosResult?.max_pos ?? -1) + 1;

    db.runSync(
        `INSERT INTO queue_items (queue_id, song_id, position) VALUES (?, ?, ?);`,
        [activeQueue.id, songId, nextPosition]
    );
}

// Delete a single queue by ID
export function deleteQueue(queueId: number) {
    db.runSync(`DELETE FROM queues WHERE id = ?;`, [queueId]);
}

// Clear active queue items
export function clearQueue() {
    const activeQueue = db.getFirstSync<{ id: number }>(
        `SELECT id FROM queues WHERE is_active = 1;`
    );
    if (activeQueue) {
        db.runSync(`DELETE FROM queue_items WHERE queue_id = ?;`, [activeQueue.id]);
    }
}