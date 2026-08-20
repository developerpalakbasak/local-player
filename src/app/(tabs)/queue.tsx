import Ionicons from '@expo/vector-icons/Ionicons';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { PRIMARY } from '../../constants/colors';

const queue = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    duration: '3:20',
  },
  {
    id: '2',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    duration: '3:35',
  },
  {
    id: '3',
    title: 'Levitating',
    artist: 'Dua Lipa',
    duration: '3:23',
  },
  {
    id: '4',
    title: 'As It Was',
    artist: 'Harry Styles',
    duration: '2:47',
  },
  {
    id: '5',
    title: 'Heat Waves',
    artist: 'Glass Animals',
    duration: '3:58',
  },
  {
    id: '6',
    title: 'Stay',
    artist: 'The Kid LAROI',
    duration: '2:21',
  },
  {
    id: '7',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    duration: '4:23',
  },
];

export default function Queue() {
  const isDark = useColorScheme() === 'dark';

  const colors = {
    background: isDark ? '#09090b' : '#f8fafc',
    card: isDark ? '#18181b' : '#ffffff',
    text: isDark ? '#ffffff' : '#111827',
    secondary: isDark ? '#a1a1aa' : '#6b7280',
    border: isDark ? '#27272a' : '#e5e7eb',
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            Queue
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.secondary },
            ]}
          >
            {queue.length} songs waiting
          </Text>
        </View>

        <Pressable>
          <Ionicons
            name="ellipsis-horizontal"
            size={25}
            color={colors.text}
          />
        </Pressable>
      </View>

      <FlatList
        data={queue}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <Pressable
            style={[
              styles.song,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.number}>
              <Text style={{ color: colors.secondary }}>
                {index + 1}
              </Text>
            </View>

            <View style={styles.songIcon}>
              <Ionicons
                name="musical-note"
                size={20}
                color={PRIMARY}
              />
            </View>

            <View style={styles.songInfo}>
              <Text
                numberOfLines={1}
                style={[
                  styles.songTitle,
                  { color: colors.text },
                ]}
              >
                {item.title}
              </Text>

              <Text
                numberOfLines={1}
                style={[
                  styles.artist,
                  { color: colors.secondary },
                ]}
              >
                {item.artist}
              </Text>
            </View>

            <Text style={{ color: colors.secondary }}>
              {item.duration}
            </Text>

            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={colors.secondary}
              style={{ marginLeft: 10 }}
            />
          </Pressable>
        )}
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
    paddingBottom: 12,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
  },

  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 10,
  },

  song: {
    minHeight: 62,

    borderRadius: 16,
    borderWidth: 1,

    paddingHorizontal: 8,

    flexDirection: 'row',
    alignItems: 'center',
  },

  number: {
    width: 30,
    alignItems: 'center',
  },

  songIcon: {
    width: 40,
    height: 40,

    borderRadius: 12,
    backgroundColor: '#d9f8ef',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  songInfo: {
    flex: 1,
  },

  songTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  artist: {
    marginTop: 4,
    fontSize: 13,
  },
});