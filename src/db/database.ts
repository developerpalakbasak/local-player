import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('music.db');

export function initDatabase() {

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

        CREATE INDEX IF NOT EXISTS idx_songs_folder
        ON songs(folder_path);
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