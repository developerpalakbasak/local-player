//getAudios.ts
import { getDatabase } from '@/db/database';
import { useState } from 'react';

export type Audio = {
    id: string;
    filename: string;
    uri: string;
    folder_name: string;
    folder_path: string;
    duration: number;
    album_id: string | null;
    creation_time: number;
    modification_time: number;
};

export function useAudios() {
    const [audioFiles, setAudioFiles] =
        useState<Audio[]>([]);

    const [loading, setLoading] =
        useState(false);

    // Get ALL audios from database
    async function getAllAudios() {
        setLoading(true);

        try {
            const db = getDatabase();

            const result = db.getAllSync<Audio>(`
                SELECT *
                FROM songs
                ORDER BY filename COLLATE NOCASE
            `);

            setAudioFiles(result);

            console.log(
                'All Audios from DB:',
                result
            );

            return result;
        } catch (error) {
            console.error(
                'Error getting audios from database:',
                error
            );

            return [];
        } finally {
            setLoading(false);
        }
    }

    // Get audios from a specific folder
    async function getAudiosFromFolder(
        folderName: string
    ) {
        setLoading(true);

        try {
            const db = getDatabase();

            const result = db.getAllSync<Audio>(
                `
                SELECT *
                FROM songs
                WHERE folder_name = ?
                ORDER BY filename COLLATE NOCASE
                `,
                [folderName]
            );

            setAudioFiles(result);

            console.log(
                `Audios from "${folderName}" from DB:`,
                result
            );

            return result;
        } catch (error) {
            console.error(
                'Error getting folder audios:',
                error
            );

            return [];
        } finally {
            setLoading(false);
        }
    }

    return {
        audioFiles,
        loading,
        getAllAudios,
        getAudiosFromFolder,
    };
}