import Ionicons from '@expo/vector-icons/Ionicons';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

const PRIMARY = '#2cd1a1';

const folders = [
    {
        id: 'all-music',
        name: 'All Music',
        songs: 128,
        type: 'all',
    },
    {
        id: 'downloads',
        name: 'Downloads',
        songs: 42,
        type: 'folder',
    },
    {
        id: 'aloneness',
        name: 'Aloneness',
        songs: 27,
        type: 'folder',
    },
    {
        id: 'chill',
        name: 'Chill Music',
        songs: 31,
        type: 'folder',
    },
    {
        id: 'workout',
        name: 'Workout',
        songs: 18,
        type: 'folder',
    },
    {
        id: 'old-songs',
        name: 'Old Songs',
        songs: 56,
        type: 'folder',
    },
    {
        id: 'bangla',
        name: 'Bangla Songs',
        songs: 34,
        type: 'folder',
    },
    {
        id: 'english',
        name: 'English Songs',
        songs: 47,
        type: 'folder',
    },
];

export default function Folders() {
    const isDark = useColorScheme() === 'dark';

    const colors = {
        background: isDark ? '#09090b' : '#f8fafc',
        card: isDark ? '#18181b' : '#ffffff',
        text: isDark ? '#ffffff' : '#111827',
        secondary: isDark ? '#a1a1aa' : '#6b7280',
        border: isDark ? '#27272a' : '#e5e7eb',

        allMusicBackground: isDark
            ? '#12352e'
            : '#d9f8ef',

        allMusicBorder: isDark
            ? '#1d594b'
            : '#a9ead8',
    };

    function openFolder(folder: (typeof folders)[number]) {
        console.log('Open:', folder.name);
    }

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
                        {folders.length - 1} folders • All Music
                    </Text>
                </View>

                <Pressable style={styles.addButton}>
                    <Ionicons
                        name="add"
                        size={25}
                        color="#fff"
                    />
                </Pressable>
            </View>

            {/* Folder List */}

            <FlatList
                data={folders}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => {
                    const isAllMusic = item.type === 'all';

                    return (
                        <Pressable
                            onPress={() => openFolder(item)}
                            style={[
                                styles.folder,

                                {
                                    backgroundColor: isAllMusic
                                        ? colors.allMusicBackground
                                        : colors.card,

                                    borderColor: isAllMusic
                                        ? colors.allMusicBorder
                                        : colors.border,
                                },

                                isAllMusic && styles.allMusicFolder,
                            ]}
                        >
                            {/* Icon */}

                            <View
                                style={[
                                    styles.folderIcon,

                                    {
                                        backgroundColor: isAllMusic
                                            ? PRIMARY
                                            : isDark
                                                ? '#27272a'
                                                : '#f1f5f9',
                                    },
                                ]}
                            >
                                <Ionicons
                                    name={
                                        isAllMusic
                                            ? 'musical-notes'
                                            : 'folder'
                                    }
                                    size={23}
                                    color={
                                        isAllMusic
                                            ? '#fff'
                                            : PRIMARY
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

                                    {isAllMusic && (
                                        <View style={styles.allMusicBadge}>
                                            <Text style={styles.badgeText}>
                                                ALL
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <Text
                                    style={[
                                        styles.songCount,
                                        {
                                            color: colors.secondary,
                                        },
                                    ]}
                                >
                                    {isAllMusic
                                        ? `${item.songs} songs • All audio files`
                                        : `${item.songs} songs`}
                                </Text>
                            </View>

                            {/* Arrow */}

                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={
                                    isAllMusic
                                        ? PRIMARY
                                        : colors.secondary
                                }
                            />
                        </Pressable>
                    );
                }}
            />
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
        paddingBottom: 14,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    title: {
        fontSize: 28,
        fontWeight: '800',
    },

    subtitle: {
        marginTop: 4,
        fontSize: 13,
    },

    addButton: {
        width: 42,
        height: 42,

        borderRadius: 14,

        backgroundColor: PRIMARY,

        justifyContent: 'center',
        alignItems: 'center',
    },

    list: {
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 10,

        gap: 10,
    },

    folder: {
        minHeight: 68,

        borderRadius: 16,
        borderWidth: 1,

        paddingHorizontal: 10,

        flexDirection: 'row',
        alignItems: 'center',
    },

    allMusicFolder: {
        minHeight: 76,
    },

    folderIcon: {
        width: 44,
        height: 44,

        borderRadius: 13,

        justifyContent: 'center',
        alignItems: 'center',

        marginRight: 12,
    },

    folderInfo: {
        flex: 1,
    },

    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    folderName: {
        fontSize: 16,
        fontWeight: '700',
    },

    allMusicBadge: {
        marginLeft: 8,

        paddingHorizontal: 7,
        paddingVertical: 3,

        borderRadius: 6,

        backgroundColor: PRIMARY,
    },

    badgeText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '800',
    },

    songCount: {
        marginTop: 4,
        fontSize: 13,
    },
});