import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { PRIMARY } from '../constants/colors';

const settings = [
  {
    id: '1',
    title: 'Appearance',
    subtitle: 'Theme and display',
    icon: 'color-palette-outline',
  },
  {
    id: '2',
    title: 'Playback',
    subtitle: 'Audio quality and behavior',
    icon: 'play-circle-outline',
  },
  {
    id: '3',
    title: 'Equalizer',
    subtitle: 'Customize your sound',
    icon: 'options-outline',
  },
  {
    id: '4',
    title: 'Notifications',
    subtitle: 'Playback notifications',
    icon: 'notifications-outline',
  },
  {
    id: '5',
    title: 'Storage',
    subtitle: 'Music and cache',
    icon: 'server-outline',
  },
];

export default function Settings() {
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
          <Text
            style={[
              styles.title,
              { color: colors.text },
            ]}
          >
            Settings
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.secondary },
            ]}
          >
            Customize your music player
          </Text>
        </View>

        <View style={styles.profile}>
          <Ionicons
            name="person"
            size={21}
            color={PRIMARY}
          />
        </View>
      </View>

      <View style={styles.list}>
        {settings.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.setting,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.iconBox}>
              <Ionicons
                name={item.icon as any}
                size={22}
                color={PRIMARY}
              />
            </View>

            <View style={styles.info}>
              <Text
                style={[
                  styles.settingTitle,
                  { color: colors.text },
                ]}
              >
                {item.title}
              </Text>

              <Text
                style={[
                  styles.settingSubtitle,
                  { color: colors.secondary },
                ]}
              >
                {item.subtitle}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color={colors.secondary}
            />
          </Pressable>
        ))}
      </View>

      <View
        style={[
          styles.version,
          { borderTopColor: colors.border },
        ]}
      >
        <Text style={{ color: colors.secondary }}>
          Music Player
        </Text>

        <Text style={{ color: colors.secondary }}>
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
    backgroundColor: '#d9f8ef',

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
    backgroundColor: '#d9f8ef',

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