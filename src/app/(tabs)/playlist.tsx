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

const playlists = [
  {
    id: '1',
    name: 'My Favorites',
    songs: 24,
    description: 'Songs you love',
  },
  {
    id: '2',
    name: 'Chill Vibes',
    songs: 31,
    description: 'Relax and enjoy',
  },
  {
    id: '3',
    name: 'Workout',
    songs: 18,
    description: 'Energy for your workout',
  },
  {
    id: '4',
    name: 'Road Trip',
    songs: 42,
    description: 'Perfect road songs',
  },
  {
    id: '5',
    name: 'Late Night',
    songs: 16,
    description: 'Music after midnight',
  },
];

export default function Playlist() {
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
            Playlists
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.secondary },
            ]}
          >
            {playlists.length} playlists
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

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.playlist,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.cover}>
              <Ionicons
                name="musical-notes"
                size={30}
                color={PRIMARY}
              />
            </View>

            <View style={styles.info}>
              <Text
                numberOfLines={1}
                style={[
                  styles.name,
                  { color: colors.text },
                ]}
              >
                {item.name}
              </Text>

              <Text
                numberOfLines={1}
                style={[
                  styles.description,
                  { color: colors.secondary },
                ]}
              >
                {item.description}
              </Text>

              <Text
                style={[
                  styles.songs,
                  { color: colors.secondary },
                ]}
              >
                {item.songs} songs
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.secondary}
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
    paddingBottom: 10,
    gap: 10,
  },

  playlist: {
    minHeight: 82,

    borderRadius: 17,
    borderWidth: 1,

    padding: 10,

    flexDirection: 'row',
    alignItems: 'center',
  },

  cover: {
    width: 60,
    height: 60,

    borderRadius: 14,
    backgroundColor: '#d9f8ef',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 13,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 17,
    fontWeight: '700',
  },

  description: {
    marginTop: 4,
    fontSize: 13,
  },

  songs: {
    marginTop: 3,
    fontSize: 12,
  },
});