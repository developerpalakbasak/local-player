//getFolders.ts
import { getDatabase } from '@/db/database';
import { useState } from 'react';

export type AudioFolder = {
    id: string;
    name: string;
    path: string;
    songs: number;
};

export function useAudioFolders() {
    const [folders, setFolders] = useState<AudioFolder[]>([]);
    const [loading, setLoading] = useState(false);

    async function getAudioFolders() {
        setLoading(true);

        try {
            const db = getDatabase();

            const result = db.getAllSync<AudioFolder>(`
                SELECT
                    id,
                    name,
                    path,
                    songs
                FROM folders
                ORDER BY name COLLATE NOCASE
            `);

            setFolders(result);

            console.log('Folders from DB:', result);

            return result;
        } catch (error) {
            console.error(
                'Error getting folders from database:',
                error
            );

            return [];
        } finally {
            setLoading(false);
        }
    }

    return {
        folders,
        loading,
        getAudioFolders,
    };
}