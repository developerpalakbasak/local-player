import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundColor = isDarkMode ? '#000' : '#fff';

  return (
    <SafeAreaProvider>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor },
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}