import * as MediaLibrary from 'expo-media-library/legacy';
import { getDatabase } from './database';

export type SyncResult = {
    success: boolean;
    songs: number;
    folders: number;
    syncedAt: Date;
};

export async function syncMusicLibrary(): Promise<SyncResult> {
    const db = getDatabase();

    try {
        const permission =
            await MediaLibrary.requestPermissionsAsync();

        if (!permission.granted) {
            console.log('Music permission denied');

            return {
                success: false,
                songs: 0,
                folders: 0,
                syncedAt: new Date(),
            };
        }

        console.log('Scanning music library...');

        const allAudios: MediaLibrary.Asset[] = [];

        let result =
            await MediaLibrary.getAssetsAsync({
                mediaType:
                    MediaLibrary.MediaType.audio,
                first: 100,
            });

        allAudios.push(...result.assets);

        while (result.hasNextPage) {
            result =
                await MediaLibrary.getAssetsAsync({
                    mediaType:
                        MediaLibrary.MediaType.audio,
                    first: 100,
                    after: result.endCursor,
                });

            allAudios.push(...result.assets);
        }

        console.log(
            `Found ${allAudios.length} audio files`
        );

        const folderMap = new Map<
            string,
            {
                id: string;
                name: string;
                path: string;
                songs: number;
            }
        >();

        for (const audio of allAudios) {
            const parts = audio.uri.split('/');

            if (parts.length < 2) {
                continue;
            }

            parts.pop();

            const folderName =
                parts[parts.length - 1];

            if (!folderName) {
                continue;
            }

            const folderPath = parts.join('/');
            const folderId = folderPath;

            const existingFolder =
                folderMap.get(folderId);

            if (existingFolder) {
                existingFolder.songs += 1;
            } else {
                folderMap.set(folderId, {
                    id: folderId,
                    name: folderName,
                    path: folderPath,
                    songs: 1,
                });
            }

            db.runSync(
                `
                INSERT OR REPLACE INTO songs (
                    id,
                    filename,
                    uri,
                    folder_name,
                    folder_path,
                    duration,
                    album_id,
                    creation_time,
                    modification_time
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    audio.id,
                    audio.filename,
                    audio.uri,
                    folderName,
                    folderPath,
                    audio.duration ?? 0,
                    audio.albumId ?? null,
                    audio.creationTime ?? 0,
                    audio.modificationTime ?? 0,
                ]
            );
        }

        for (const folder of folderMap.values()) {
            db.runSync(
                `
                INSERT OR REPLACE INTO folders (
                    id,
                    name,
                    path,
                    songs
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    folder.id,
                    folder.name,
                    folder.path,
                    folder.songs,
                ]
            );
        }

        const syncedAt = new Date();

        console.log(
            `Saved ${allAudios.length} songs`
        );

        console.log(
            `Saved ${folderMap.size} folders`
        );

        return {
            success: true,
            songs: allAudios.length,
            folders: folderMap.size,
            syncedAt,
        };

    } catch (error) {
        console.error(
            'Music sync error:',
            error
        );

        return {
            success: false,
            songs: 0,
            folders: 0,
            syncedAt: new Date(),
        };
    }
}