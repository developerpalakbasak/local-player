import { useAudio } from '@/context/AudioContext';
import { getQueue, getQueueName, QueueItem } from '@/db/database';
import { useTheme } from '@/hooks/useColors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PRIMARY } from '../../constants/colors';

export default function Queue() {
  const { colors } = useTheme();
  const { playAtIndex } = useAudio();

  const [queueName, setQueueName] = useState<string>('Queue');
  const [queue, setQueue] = useState<QueueItem[]>([]);

  // Automatically reload data whenever the user navigates back to this screen
  useFocusEffect(
    useCallback(() => {
      loadQueueData();
    }, [])
  );

  const loadQueueData = () => {
    const name = getQueueName();
    const items = getQueue();

    setQueueName(name);
    setQueue(items);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text
            numberOfLines={1}
            style={[styles.title, { color: colors.text }]}
          >
            {queueName}
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.secondary },
            ]}
          >
            {queue.length} {queue.length === 1 ? 'song' : 'songs'} in queue
          </Text>
        </View>

        <Pressable hitSlop={10}>
          <Ionicons
            name="chevron-down-circle-outline"
            size={25}
            color={colors.text}
          />
        </Pressable>
      </View>

      {/* Queue List */}
      <FlatList
        data={queue}
        keyExtractor={(item, index) =>
          item.queue_item_id
            ? `${item.queue_item_id}`
            : `${item.id}-${index}`
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => playAtIndex(index)}
            style={[
              styles.song,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Track Index Position */}
            <View style={styles.number}>
              <Text style={{ color: colors.secondary }}>
                {index + 1}
              </Text>
            </View>

            {/* Song Icon */}
            <View style={styles.songIcon}>
              <Ionicons
                name="musical-note"
                size={20}
                color={PRIMARY}
              />
            </View>

            {/* Song Information */}
            <View style={styles.songInfo}>
              <Text
                numberOfLines={1}
                style={[
                  styles.songTitle,
                  { color: colors.text },
                ]}
              >
                {item.filename}
              </Text>

              <Text
                numberOfLines={1}
                style={[
                  styles.artist,
                  { color: colors.secondary },
                ]}
              >
                {item.uri ? 'Local Audio' : 'Unknown Artist'}
              </Text>
            </View>

            {/* Formatted Duration */}
            <Text style={{ color: colors.secondary, fontSize: 12 }}>
              {formatDuration(item.duration)}
            </Text>

            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={colors.secondary}
              style={{ marginLeft: 10 }}
            />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="musical-notes-outline"
              size={44}
              color={colors.secondary}
            />
            <Text
              style={[
                styles.emptyText,
                { color: colors.secondary },
              ]}
            >
              No songs in queue
            </Text>
          </View>
        }
      />
    </View>
  );
}

function formatDuration(seconds: number) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
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
  headerTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
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
    width: 28,
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
    minWidth: 0,
  },
  songTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  artist: {
    marginTop: 2,
    fontSize: 12,
  },
  empty: {
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
  },
});