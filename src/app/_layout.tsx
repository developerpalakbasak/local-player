// app/_layout.tsx

import {
    hasMusicData,
    initDatabase,
} from '@/db/database';
import { syncMusicLibrary } from '@/db/musicSync';
import { useTheme } from '@/hooks/useColors';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
    SafeAreaProvider,
    SafeAreaView,
} from 'react-native-safe-area-context';

export default function RootLayout() {
    const { isDark, colors } = useTheme();

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
        <SafeAreaProvider>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <SafeAreaView
                style={[
                    styles.safeArea,
                    {
                        backgroundColor: colors.background,
                    },
                ]}
                edges={['top', 'bottom']}
            >
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: {
                            backgroundColor: colors.background,
                        },
                    }}
                >
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="folder/[name]" />
                </Stack>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
});