import { PRIMARY, PRIMARY_LIGHT, PRIMARY_LIGHT_DARK } from '@/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';


export default function NowPlaying() {
    const isDark = useColorScheme() === 'dark';

    const colors = {
        background: isDark ? '#09090b' : '#f8fafc',
        text: isDark ? '#ffffff' : '#111827',
        secondary: isDark ? '#a1a1aa' : '#6b7280',
        progressBackground: isDark ? '#3f3f46' : '#d4d4d8',
        border: isDark ? '#27272a' : '#e5e7eb',

        albumBackground: isDark
            ? PRIMARY_LIGHT_DARK
            : PRIMARY_LIGHT,

        albumInner: isDark
            ? '#1b4d42'
            : '#b8f0df',
    };

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
                            styles.headerTitle,
                            {
                                color: colors.text,
                            },
                        ]}
                    >
                        Now Playing
                    </Text>

                    <Text
                        style={[
                            styles.headerSubtitle,
                            {
                                color: colors.secondary,
                            },
                        ]}
                    >
                        Playing from Queue
                    </Text>
                </View>

                <Pressable>
                    <Ionicons
                        name="ellipsis-horizontal"
                        size={24}
                        color={colors.text}
                    />
                </Pressable>
            </View>

            {/* Main Content */}

            <View style={styles.content}>

                {/* Album */}

                <View
                    style={[
                        styles.album,
                        {
                            backgroundColor: colors.albumBackground,
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.albumInner,
                            {
                                backgroundColor: colors.albumInner,
                            },
                        ]}
                    >
                        <Ionicons
                            name="musical-notes"
                            size={70}
                            color={PRIMARY}
                        />
                    </View>
                </View>

                {/* Song */}

                <Text
                    numberOfLines={1}
                    style={[
                        styles.title,
                        {
                            color: colors.text,
                        },
                    ]}
                >
                    Blinding Lights
                </Text>

                <Text
                    style={[
                        styles.artist,
                        {
                            color: colors.secondary,
                        },
                    ]}
                >
                    The Weeknd
                </Text>

                {/* Progress */}

                <View style={styles.progressContainer}>
                    <View
                        style={[
                            styles.progressBackground,
                            {
                                backgroundColor:
                                    colors.progressBackground,
                            },
                        ]}
                    >
                        <View style={styles.progress} />
                    </View>

                    <View style={styles.timeRow}>
                        <Text style={{ color: colors.secondary }}>
                            1:24
                        </Text>

                        <Text style={{ color: colors.secondary }}>
                            3:20
                        </Text>
                    </View>
                </View>

                {/* Player Controls */}

                <View style={styles.controls}>
                    <Pressable>
                        <Ionicons
                            name="shuffle"
                            size={23}
                            color={colors.secondary}
                        />
                    </Pressable>

                    <Pressable>
                        <Ionicons
                            name="play-skip-back"
                            size={28}
                            color={colors.text}
                        />
                    </Pressable>

                    <Pressable style={styles.playButton}>
                        <Ionicons
                            name="pause"
                            size={28}
                            color="#fff"
                        />
                    </Pressable>

                    <Pressable>
                        <Ionicons
                            name="play-skip-forward"
                            size={28}
                            color={colors.text}
                        />
                    </Pressable>

                    <Pressable>
                        <Ionicons
                            name="repeat"
                            size={23}
                            color={colors.secondary}
                        />
                    </Pressable>
                </View>

                {/* Bottom Actions */}

                <View
                    style={[
                        styles.bottomActions,
                        {
                            borderTopColor: colors.border,
                        },
                    ]}
                >
                    <Pressable>
                        <Ionicons
                            name="heart-outline"
                            size={23}
                            color={colors.secondary}
                        />
                    </Pressable>

                    <Pressable>
                        <Ionicons
                            name="list-outline"
                            size={23}
                            color={colors.secondary}
                        />
                    </Pressable>

                    <Pressable>
                        <Ionicons
                            name="share-outline"
                            size={23}
                            color={colors.secondary}
                        />
                    </Pressable>
                </View>
            </View>
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
        paddingBottom: 8,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
    },

    headerSubtitle: {
        marginTop: 3,
        fontSize: 12,
    },

    content: {
        flex: 1,

        alignItems: 'center',

        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 10,

        justifyContent: 'space-between',
    },

    album: {
        width: 240,
        height: 240,

        borderRadius: 28,

        justifyContent: 'center',
        alignItems: 'center',
    },

    albumInner: {
        width: 180,
        height: 180,

        borderRadius: 90,

        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        width: '100%',

        fontSize: 24,
        fontWeight: '800',

        textAlign: 'center',

        marginTop: 8,
    },

    artist: {
        fontSize: 15,
        marginTop: 2,
    },

    progressContainer: {
        width: '100%',
    },

    progressBackground: {
        height: 5,

        borderRadius: 5,

        overflow: 'hidden',
    },

    progress: {
        width: '42%',
        height: 5,

        backgroundColor: PRIMARY,
    },

    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginTop: 6,
    },

    controls: {
        width: '100%',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    playButton: {
        width: 60,
        height: 60,

        borderRadius: 30,

        backgroundColor: PRIMARY,

        justifyContent: 'center',
        alignItems: 'center',
    },

    bottomActions: {
        width: '100%',

        paddingTop: 12,

        borderTopWidth: 1,

        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});