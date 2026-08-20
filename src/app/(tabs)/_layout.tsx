import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useColors';
import { AudioProvider } from '@/context/AudioContext';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  queue: 'list',
  index: 'musical-notes',
  folders: 'folder',
  playlist: 'albums',
  favorites: 'heart',
  settings: 'settings',
};

export default function RootLayout() {
  const { isDark, colors } = useTheme();

  return (
    <SafeAreaProvider>
      <AudioProvider>

        <StatusBar
          style={isDark ? 'light' : 'dark'}
        />

        <SafeAreaView
          style={[
            styles.safeArea,
            {
              backgroundColor: colors.background,
            },
          ]}
          edges={['top', 'bottom']}
        >
          <Tabs
            screenOptions={{
              headerShown: false,

              sceneStyle: {
                backgroundColor: colors.background,
              },

              animation: 'none',
              lazy: false,
            }}
            tabBar={(props) => (
              <CustomTabBar
                {...props}
                colors={colors}
              />
            )}
          >
          </Tabs>
        </SafeAreaView>
      </AudioProvider>
    </SafeAreaProvider>
  );
}

function CustomTabBar({
  state,
  navigation,
  colors,
}: any) {
  const TAB_ORDER = [
    'queue',
    'index',
    'folders',
    'playlist',
    'favorites',
    'settings',
  ];

  return (
    <View
      style={[
        styles.navBar,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      ]}
    >
      {TAB_ORDER.map((routeName) => {
        // Find the actual route from React Navigation state
        const routeIndex = state.routes.findIndex(
          (route: any) => route.name === routeName
        );

        // Route doesn't exist
        if (routeIndex === -1) {
          return null;
        }

        const route = state.routes[routeIndex];

        const isFocused =
          state.index === routeIndex;

        const icon = ICONS[routeName];

        return (
          <Pressable
            key={route.key}
            style={styles.navItem}
            android_ripple={null}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (
                !isFocused &&
                !event.defaultPrevented
              ) {
                navigation.navigate(routeName);
              }
            }}
          >
            <Ionicons
              name={
                isFocused
                  ? icon
                  : (`${icon}-outline` as any)
              }
              size={24}
              color={
                isFocused
                  ? colors.primary
                  : colors.secondary
              }
            />
          </Pressable>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  navBar: {
    height: 52,

    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    borderTopWidth:
      StyleSheet.hairlineWidth,
  },

  navItem: {
    width: 50,
    height: 50,

    alignItems: 'center',
    justifyContent: 'center',
  },
});