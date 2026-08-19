import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

export default function RootLayout() {
  const isDarkMode = useColorScheme() === 'dark';
  const pathname = usePathname();

  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const iconColor = isDarkMode ? '#fff' : '#000';
  const activeIconColor = '#1DB954';

  const menuItems = useMemo(
    () => [
      {
        icon: 'list-outline',
        activeIcon: 'list',
        href: '/queue',
      },
      {
        icon: 'musical-notes-outline',
        activeIcon: 'musical-notes',
        href: '/now-playing',
      },
      {
        icon: 'folder-outline',
        activeIcon: 'folder',
        href: '/folders',
      },
      {
        icon: 'albums-outline',
        activeIcon: 'albums',
        href: '/playlist',
      },
      {
        icon: 'heart-outline',
        activeIcon: 'heart',
        href: '/favorites',
      },
      {
        icon: 'settings-outline',
        activeIcon: 'settings',
        href: '/settings',
      },
    ] as const,
    []
  );

  const NavigationBar = useMemo(
    () => (
      <View
        style={[
          styles.navBar,
          {
            backgroundColor,
          },
        ]}
      >
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              asChild
            >
              <Pressable style={styles.navItem}>
                <Ionicons
                  name={
                    isActive
                      ? item.activeIcon
                      : item.icon
                  }
                  size={24}
                  color={
                    isActive
                      ? activeIconColor
                      : iconColor
                  }
                />
              </Pressable>
            </Link>
          );
        })}
      </View>
    ),
    [
      menuItems,
      pathname,
      iconColor,
      activeIconColor,
      backgroundColor,
    ]
  );

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      contentStyle: {
        backgroundColor,
      },
      animation: 'fade' as const,
      animationDuration: 200,
      gestureEnabled: true,
      detachPreviousScreen: true,
    }),
    [backgroundColor]
  );

  return (
    <SafeAreaProvider>
      <StatusBar
        style={isDarkMode ? 'light' : 'dark'}
      />

      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor,
          },
        ]}
        edges={['top', 'bottom']}
      >

        {/* ONLY this area belongs to pages */}
        <View style={styles.stackContainer}>
          <Stack screenOptions={screenOptions} />
        </View>

        {/* Navigation starts here */}
        {NavigationBar}

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  stackContainer: {
    flex: 1,
    minHeight: 0,
  },

  navBar: {
    height: 52,

    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(128,128,128,0.3)',
  },

  navItem: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});