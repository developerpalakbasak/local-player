import Ionicons from '@expo/vector-icons/Ionicons';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { PRIMARY } from '../constants/colors';

const favorites = [
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
];

export default function Favorites() {
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
            Favorites
          </Text>

          <Text style={[styles.subtitle, { color: colors.secondary }]}>
            {favorites.length} favorite songs
          </Text>
        </View>

        <Ionicons
          name="heart"
          size={25}
          color={PRIMARY}
        />
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.song,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.album}>
              <Ionicons
                name="musical-notes"
                size={22}
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
              name="heart"
              size={20}
              color={PRIMARY}
              style={styles.heart}
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
    fontSize: 28,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },

  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 10,
  },

  song: {
    minHeight: 64,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 10,

    flexDirection: 'row',
    alignItems: 'center',
  },

  album: {
    width: 42,
    height: 42,
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

  heart: {
    marginLeft: 12,
  },
});