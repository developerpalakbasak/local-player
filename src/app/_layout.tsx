import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View, Pressable, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  queue: 'list',
  'now-playing': 'musical-notes',
  folders: 'folder',
  playlist: 'albums',
  favorites: 'heart',
  settings: 'settings',
};

export default function RootLayout() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const iconColor = isDarkMode ? '#fff' : '#000';
  const activeIconColor = '#1DB954';

  return (
    <SafeAreaProvider>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top', 'bottom']}>
        <Tabs
          screenOptions={{
            headerShown: false,
            sceneStyle: { backgroundColor },
            animation: 'none',
            lazy: false,
          }}
          tabBar={(props) => (
            <CustomTabBar
              {...props}
              backgroundColor={backgroundColor}
              iconColor={iconColor}
              activeIconColor={activeIconColor}
            />
          )}
        >
          <Tabs.Screen name="queue" />
          <Tabs.Screen name="now-playing" />
          <Tabs.Screen name="folders" />
          <Tabs.Screen name="playlist" />
          <Tabs.Screen name="favorites" />
          <Tabs.Screen name="settings" />
        </Tabs>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function CustomTabBar({ state, navigation, backgroundColor, iconColor, activeIconColor }: any) {
  const router = useRouter();

  return (
    <View style={[styles.navBar, { backgroundColor }]}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const icon = ICONS[route.name] ?? 'ellipse';
        if (route.name === "index") return
        return (
          <Pressable
            key={route.key}
            style={styles.navItem}
            android_ripple={null}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) {
                router.replace(`/${route.name}` as any);
              }
            }}
          >
            <Ionicons
              name={isFocused ? icon : (`${icon}-outline` as any)}
              size={24}
              color={isFocused ? activeIconColor : iconColor}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(128,128,128,0.3)',
  },
  navItem: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center' },
});