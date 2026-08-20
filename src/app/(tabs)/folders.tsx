import { useAudioFolders } from '@/hooks/getFolders';
import { useTheme } from '@/hooks/useColors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function Folders() {
    const { colors } = useTheme();

    const {
        folders,
        loading,
        getAudioFolders,
    } = useAudioFolders();

    useEffect(() => {
        getAudioFolders();
    }, []);

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
                <View>
                    <Text
                        style={[
                            styles.title,
                            {
                                color: colors.text,
                            },
                        ]}
                    >
                        Folders
                    </Text>

                    <Text
                        style={[
                            styles.subtitle,
                            {
                                color: colors.secondary,
                            },
                        ]}
                    >
                        {folders.length} folders
                    </Text>
                </View>

                <Pressable
                    style={[
                        styles.addButton,
                        {
                            backgroundColor: colors.primary,
                        },
                    ]}
                >
                    <Ionicons
                        name="add"
                        size={23}
                        color={colors.white}
                    />
                </Pressable>
            </View>

            {/* Folder List */}

            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator
                        size="small"
                        color={colors.primary}
                    />
                </View>
            ) : (
                <FlatList
                    data={folders}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }: { item: any }) => {
                        const isAllMusic = item.type === 'all';

                        const displayPath = item.path
                            ?.replace(
                                'file:///storage/emulated/0/',
                                'Internal Storage > ',
                            )
                            .replace(/\//g, ' > ');

                        return (
                            <Pressable
                                onPress={() =>
                                    router.push({
                                        pathname: '/folder/[name]',
                                        params: {
                                            name: item.name,
                                        },
                                    })
                                }
                                style={[
                                    styles.folder,
                                    {
                                        backgroundColor: isAllMusic
                                            ? colors.primaryLight
                                            : colors.card,
                                    },
                                ]}
                            >
                                {/* Icon */}

                                <View
                                    style={[
                                        styles.folderIcon,
                                        {
                                            backgroundColor: isAllMusic
                                                ? colors.primary
                                                : colors.iconBackground,
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name={
                                            isAllMusic
                                                ? 'musical-notes'
                                                : 'folder'
                                        }
                                        size={18}
                                        color={
                                            isAllMusic
                                                ? colors.primary
                                                : colors.bw
                                        }
                                    />
                                </View>

                                {/* Information */}

                                <View style={styles.folderInfo}>
                                    <View style={styles.nameRow}>
                                        <Text
                                            numberOfLines={1}
                                            style={[
                                                styles.folderName,
                                                {
                                                    color: colors.text,
                                                },
                                            ]}
                                        >
                                            {item.name}
                                        </Text>

                                        <Text
                                            style={[
                                                styles.songCount,
                                                {
                                                    color: colors.secondary,
                                                },
                                            ]}
                                        >
                                            • {item.songs} songs
                                        </Text>

                                        {isAllMusic && (
                                            <View
                                                style={[
                                                    styles.allMusicBadge,
                                                    {
                                                        backgroundColor:
                                                            colors.primary,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.badgeText,
                                                        {
                                                            color: colors.white,
                                                        },
                                                    ]}
                                                >
                                                    ALL
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Path */}

                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="middle"
                                        style={[
                                            styles.folderPath,
                                            {
                                                color: colors.secondary,
                                            },
                                        ]}
                                    >
                                        {displayPath}
                                    </Text>
                                </View>

                                {/* Arrow */}

                                <Ionicons
                                    name="chevron-forward"
                                    size={18}
                                    color={colors.secondary}
                                />
                            </Pressable>
                        );
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    header: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 12,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    title: {
        fontSize: 24,
        fontWeight: '800',
    },

    subtitle: {
        marginTop: 2,
        fontSize: 12,
    },

    addButton: {
        width: 40,
        height: 40,

        borderRadius: 13,

        justifyContent: 'center',
        alignItems: 'center',
    },

    list: {
        paddingHorizontal: 12,
        paddingBottom: 10,
    },

    folder: {
        minHeight: 56,

        borderRadius: 5,

        paddingHorizontal: 8,
        paddingVertical: 7,

        marginBottom: 4,

        flexDirection: 'row',
        alignItems: 'center',
    },

    folderIcon: {
        width: 32,
        height: 32,

        borderRadius: 8,

        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 10,
    },

    folderInfo: {
        flex: 1,
        minWidth: 0,
    },

    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 0,
    },

    folderName: {
        maxWidth: '65%',

        fontSize: 15,
        fontWeight: '700',
    },

    songCount: {
        marginLeft: 5,

        fontSize: 11,
    },

    folderPath: {
        marginTop: 3,

        fontSize: 9.5,

        opacity: 0.8,
    },

    allMusicBadge: {
        marginLeft: 6,

        paddingHorizontal: 6,
        paddingVertical: 2,

        borderRadius: 5,
    },

    badgeText: {
        fontSize: 8,
        fontWeight: '800',
    },

    loading: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
    },
});