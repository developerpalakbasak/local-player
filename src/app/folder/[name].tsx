import { createQueue } from '@/db/database';
import { useAudios } from '@/hooks/getAudios';
import { useAudioFolders } from '@/hooks/getFolders';
import { useTheme } from '@/hooks/useColors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function FolderDetailScreen() {
    const { name } = useLocalSearchParams<{
        name: string;
    }>();

    const { colors } = useTheme();

    const {
        folders,
        loading: foldersLoading,
        getAudioFolders,
    } = useAudioFolders();

    const {
        audioFiles,
        loading: audiosLoading,
        getAudiosFromFolder,
    } = useAudios();

    useEffect(() => {
        getAudioFolders();
    }, []);

    useEffect(() => {
        if (!name) return;

        getAudiosFromFolder(name);
    }, [name]);

    // Handle song selection: reorders list from tapped song onward, writes queue to DB, routes to player
    const handleSongPress = (selectedIndex: number) => {
        if (!audioFiles || audioFiles.length === 0) return;

        // Reorder queue so the clicked track starts first
        const orderedQueue = [
            ...audioFiles.slice(selectedIndex),
            ...audioFiles.slice(0, selectedIndex),
        ];

        const songIds = orderedQueue.map((song) => song.id);

        // Save ordered song IDs into SQLite queue table
        createQueue(name, songIds);

        // Navigate to player or queue tab
        router.push('/(tabs)/queue');
    };

    const folder = folders.find(
        (item) => item.name === name
    );

    const loading =
        foldersLoading || audiosLoading;

    const displayPath = folder?.path
        ?.replace(
            'file:///storage/emulated/0/',
            'Internal Storage > '
        )
        .replace(/\//g, ' > ');

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                },
            ]}
        >
            {/* Header */}

            <View style={styles.header}>
                <Pressable
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Ionicons
                        name="arrow-back"
                        size={22}
                        color={colors.text}
                    />
                </Pressable>

                <View style={styles.headerInfo}>
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ]}
                    >
                        {name}
                    </Text>

                    <Text
                        numberOfLines={1}
                        style={[
                            styles.path,
                            {
                                color: colors.secondary,
                            },
                        ]}
                    >
                        {displayPath}
                    </Text>
                </View>
            </View>

            {/* Song Count */}

            <View style={styles.summary}>
                <Text
                    style={[
                        styles.summaryText,
                        {
                            color: colors.secondary,
                        },
                    ]}
                >
                    {audioFiles.length} songs
                </Text>
            </View>

            {/* Songs */}

            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator
                        size="small"
                        color={colors.primary}
                    />
                </View>
            ) : (
                <FlatList
                    data={audioFiles}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={
                        styles.list
                    }
                    renderItem={({ item, index }) => (
                        <Pressable
                            onPress={() => handleSongPress(index)}
                            style={[
                                styles.song,
                                {
                                    backgroundColor:
                                        colors.card,
                                },
                            ]}
                        >
                            {/* Number / Icon */}

                            <View
                                style={[
                                    styles.songIcon,
                                    {
                                        backgroundColor:
                                            colors.iconBackground,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="musical-note"
                                    size={17}
                                    color={
                                        colors.primary
                                    }
                                />
                            </View>

                            {/* Song Information */}

                            <View
                                style={
                                    styles.songInfo
                                }
                            >
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        styles.songName,
                                        {
                                            color:
                                                colors.text,
                                        },
                                    ]}
                                >
                                    {item.filename}
                                </Text>

                                <Text
                                    style={[
                                        styles.duration,
                                        {
                                            color:
                                                colors.secondary,
                                        },
                                    ]}
                                >
                                    {formatDuration(
                                        item.duration
                                    )}
                                </Text>
                            </View>

                            {/* More */}

                            <Pressable
                                hitSlop={10}
                            >
                                <Ionicons
                                    name="ellipsis-vertical"
                                    size={18}
                                    color={
                                        colors.secondary
                                    }
                                />
                            </Pressable>
                        </Pressable>
                    )}
                    ListEmptyComponent={
                        <View
                            style={
                                styles.empty
                            }
                        >
                            <Ionicons
                                name="musical-notes-outline"
                                size={40}
                                color={
                                    colors.secondary
                                }
                            />

                            <Text
                                style={[
                                    styles.emptyText,
                                    {
                                        color:
                                            colors.secondary,
                                    },
                                ]}
                            >
                                No audio files found
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

function formatDuration(seconds: number) {
    const minutes = Math.floor(
        seconds / 60
    );

    const remainingSeconds = Math.floor(
        seconds % 60
    );

    return `${minutes}:${remainingSeconds
        .toString()
        .padStart(2, '0')}`;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 8,

        flexDirection: 'row',
        alignItems: 'center',
    },

    backButton: {
        width: 40,
        height: 40,

        borderRadius: 12,

        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 8,
    },

    headerInfo: {
        flex: 1,
        minWidth: 0,
    },

    title: {
        fontSize: 22,
        fontWeight: '800',
    },

    path: {
        marginTop: 2,

        fontSize: 9.5,

        opacity: 0.8,
    },

    summary: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },

    summaryText: {
        fontSize: 12,
    },

    list: {
        paddingHorizontal: 12,
        paddingBottom: 10,
    },

    song: {
        minHeight: 56,

        borderRadius: 5,

        paddingHorizontal: 8,
        paddingVertical: 7,

        marginBottom: 4,

        flexDirection: 'row',
        alignItems: 'center',
    },

    songIcon: {
        width: 34,
        height: 34,

        borderRadius: 8,

        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 10,
    },

    songInfo: {
        flex: 1,
        minWidth: 0,
    },

    songName: {
        fontSize: 14,
        fontWeight: '600',
    },

    duration: {
        marginTop: 3,

        fontSize: 10,
    },

    loading: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
    },

    empty: {
        paddingTop: 80,

        alignItems: 'center',
    },

    emptyText: {
        marginTop: 10,

        fontSize: 13,
    },
});