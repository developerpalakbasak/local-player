// app/_layout.tsx

import {
    hasMusicData,
    initDatabase,
} from '@/db/database';

import { syncMusicLibrary } from '@/db/musicSync';
import { useTheme } from '@/hooks/useColors';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
    const { colors } = useTheme();

    useEffect(() => {
        async function initializeMusic() {
            const start = Date.now();

            try {
                console.log('1. Starting database');

                initDatabase();

                console.log(
                    '2. Database initialized:',
                    Date.now() - start,
                    'ms'
                );

                const hasData = hasMusicData();

                console.log(
                    '3. Has music:',
                    hasData,
                    Date.now() - start,
                    'ms'
                );

                if (!hasData) {
                    console.log('4. DATABASE EMPTY → SCANNING');

                    await syncMusicLibrary();

                    console.log(
                        '5. Sync finished:',
                        Date.now() - start,
                        'ms'
                    );
                } else {
                    console.log(
                        '4. DATABASE HAS DATA → NO SCAN'
                    );
                }

            } catch (error) {
                console.error(
                    'Database initialization error:',
                    error
                );
            }
        }

        initializeMusic();
    }, []);

    return (
        <Stack
            screenOptions={{
                headerShown: false,

                contentStyle: {
                    backgroundColor:
                        colors.background,
                },
            }}
        >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="folder/[name]" />
        </Stack>
    );
}