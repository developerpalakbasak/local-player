import { getDatabase } from '@/db/database';
import { syncMusicLibrary } from '@/db/musicSync';
import { useTheme } from '@/hooks/useColors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function Settings() {
  const { colors } = useTheme();

  const [syncing, setSyncing] = useState(false);

  const [musicInfo, setMusicInfo] = useState({
    songs: 0,
    folders: 0,
    syncedAt: null as Date | null,
  });

  // Read existing data from SQLite
  const loadMusicInfo = useCallback(() => {
    try {
      const db = getDatabase();

      const songsResult = db.getFirstSync<{
        count: number;
      }>(`
                SELECT COUNT(*) as count
                FROM songs
            `);

      const foldersResult = db.getFirstSync<{
        count: number;
      }>(`
                SELECT COUNT(*) as count
                FROM folders
            `);

      setMusicInfo((previous) => ({
        ...previous,
        songs: songsResult?.count ?? 0,
        folders: foldersResult?.count ?? 0,
      }));

      console.log(
        'Settings music info:',
        songsResult?.count,
        foldersResult?.count,
      );
    } catch (error) {
      console.error(
        'Error loading music info:',
        error,
      );
    }
  }, []);

  // Runs whenever Settings screen becomes active
  useFocusEffect(
    useCallback(() => {
      loadMusicInfo();
    }, [loadMusicInfo]),
  );

  async function handleSync() {
    if (syncing) return;

    setSyncing(true);

    try {
      const result = await syncMusicLibrary();

      if (result.success) {
        setMusicInfo({
          songs: result.songs,
          folders: result.folders,
          syncedAt: result.syncedAt,
        });
      }
    } catch (error) {
      console.error(
        'Sync failed:',
        error,
      );
    } finally {
      setSyncing(false);
    }
  }

  function getSyncText() {
    if (syncing) {
      return 'Scanning your music library...';
    }

    if (musicInfo.syncedAt) {
      return `Last synced at ${musicInfo.syncedAt.toLocaleTimeString()}`;
    }

    return 'Sync your music library';
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
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
            Settings
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.secondary,
              },
            ]}
          >
            Customize your music player
          </Text>
        </View>

        <View
          style={[
            styles.profile,
            {
              backgroundColor:
                colors.primaryLight,
            },
          ]}
        >
          <Ionicons
            name="person"
            size={21}
            color={colors.primary}
          />
        </View>
      </View>

      {/* Settings */}

      <View style={styles.list}>
        {/* Sync */}

        <Pressable
          disabled={syncing}
          onPress={handleSync}
          style={[
            styles.setting,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
              opacity: syncing
                ? 0.7
                : 1,
            },
          ]}
        >
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor:
                  colors.primaryLight,
              },
            ]}
          >
            {syncing ? (
              <ActivityIndicator
                size="small"
                color={
                  colors.primary
                }
              />
            ) : (
              <Ionicons
                name="sync-outline"
                size={22}
                color={
                  colors.primary
                }
              />
            )}
          </View>

          <View style={styles.info}>
            <Text
              style={[
                styles.settingTitle,
                {
                  color: colors.text,
                },
              ]}
            >
              {syncing
                ? 'Syncing Music...'
                : 'Sync Music Library'}
            </Text>

            <Text
              style={[
                styles.settingSubtitle,
                {
                  color:
                    colors.secondary,
                },
              ]}
            >
              {getSyncText()}
            </Text>
          </View>

          {!syncing && (
            <Ionicons
              name="chevron-forward"
              size={19}
              color={
                colors.secondary
              }
            />
          )}
        </Pressable>

        {/* Music Information */}

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor:
                colors.card,
              borderColor:
                colors.border,
            },
          ]}
        >
          {/* Songs */}

          <View style={styles.stat}>
            <View
              style={[
                styles.statIcon,
                {
                  backgroundColor:
                    colors.primaryLight,
                },
              ]}
            >
              <Ionicons
                name="musical-notes-outline"
                size={19}
                color={
                  colors.primary
                }
              />
            </View>

            <View>
              <Text
                style={[
                  styles.statValue,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {musicInfo.songs}
              </Text>

              <Text
                style={[
                  styles.statLabel,
                  {
                    color:
                      colors.secondary,
                  },
                ]}
              >
                Songs
              </Text>
            </View>
          </View>

          {/* Folders */}

          <View style={styles.stat}>
            <View
              style={[
                styles.statIcon,
                {
                  backgroundColor:
                    colors.primaryLight,
                },
              ]}
            >
              <Ionicons
                name="folder-outline"
                size={19}
                color={
                  colors.primary
                }
              />
            </View>

            <View>
              <Text
                style={[
                  styles.statValue,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {musicInfo.folders}
              </Text>

              <Text
                style={[
                  styles.statLabel,
                  {
                    color:
                      colors.secondary,
                  },
                ]}
              >
                Folders
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Version */}

      <View
        style={[
          styles.version,
          {
            borderTopColor:
              colors.border,
          },
        ]}
      >
        <Text
          style={{
            color:
              colors.secondary,
          }}
        >
          Music Player
        </Text>

        <Text
          style={{
            color:
              colors.secondary,
          }}
        >
          Version 1.0.0
        </Text>
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
    paddingBottom: 16,

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

  profile: {
    width: 42,
    height: 42,

    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',
  },

  list: {
    paddingHorizontal: 16,
    gap: 10,
  },

  setting: {
    minHeight: 68,

    borderRadius: 16,
    borderWidth: 1,

    paddingHorizontal: 10,

    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 44,
    height: 44,

    borderRadius: 13,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  settingSubtitle: {
    marginTop: 3,
    fontSize: 12,
  },

  infoCard: {
    minHeight: 76,

    borderRadius: 16,
    borderWidth: 1,

    paddingHorizontal: 18,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  statIcon: {
    width: 38,
    height: 38,

    borderRadius: 11,

    justifyContent: 'center',
    alignItems: 'center',
  },

  statValue: {
    fontSize: 17,
    fontWeight: '800',
  },

  statLabel: {
    marginTop: 1,
    fontSize: 11,
  },

  version: {
    marginTop: 'auto',

    marginHorizontal: 16,

    paddingTop: 14,
    paddingBottom: 8,

    borderTopWidth: 1,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});