import { useAudioPlayer } from 'expo-audio';
import * as MediaLibrary from 'expo-media-library/legacy';
import { useState } from 'react';
import { Button, FlatList, Pressable, Text, useColorScheme, View } from 'react-native';

export default function App() {
  const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);

  const isDarkMode = useColorScheme() === 'dark'

  const player = useAudioPlayer(null);

  async function getAudioFiles() {
    const permission = await MediaLibrary.requestPermissionsAsync();

    console.log('Permission:', permission);

    if (!permission.granted) {
      console.log('Permission denied');
      return;
    }

    const result = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      first: 1000,
    });

    setAudioFiles(result.assets);

    console.log('Audio files:', result.assets);
  }

  function playAudio(audio: MediaLibrary.Asset) {
    if (currentAudioId === audio.id) {
      if (player.playing) {
        player.pause();
      } else {
        player.play();
      }

      return;
    }

    player.replace(audio.uri);
    player.play();

    setCurrentAudioId(audio.id);
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: isDarkMode ? '#000' : '#fff',
      }}
    >
      <Button
        title="Get Audio Files"
        onPress={getAudioFiles}
        color={isDarkMode ? '#0A84FF' : '#007AFF'}
      />

      <FlatList
        data={audioFiles}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 10 }}
        renderItem={({ item: audio }) => {
          const isCurrent = currentAudioId === audio.id;

          return (
            <Pressable
              onPress={() => playAudio(audio)}
              style={{
                padding: 15,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: isDarkMode ? '#333' : '#ddd',
                borderRadius: 8,
                backgroundColor: isDarkMode ? '#1c1c1e' : '#f9f9f9',
              }}
            >
              <Text style={{ fontSize: 16, color: isDarkMode ? '#fff' : '#000' }}>
                {isCurrent && player.playing ? '▶️ ' : '⏸️ '}
                {audio.filename}
              </Text>

              <Text style={{ color: isDarkMode ? '#aaa' : '#555' }}>
                Duration: {audio.duration}s
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}