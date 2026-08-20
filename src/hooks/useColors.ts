// useColors.ts

import {
    BLACK,
    PRIMARY,
    PRIMARY_LIGHT,
    PRIMARY_LIGHT_DARK,
    WHITE,
} from '@/constants/colors';
import { useColorScheme } from 'react-native';

export function useTheme() {
    const isDark = useColorScheme() === 'dark';

    const colors = {
        primary: PRIMARY,
        white: WHITE,
        black: BLACK,

        bw: isDark ? WHITE : BLACK,

        background: isDark
            ? '#000000ff'
            : '#FAF9F6',

        card: isDark
            ? '#000000ff'
            : '#ffffffff',

        text: isDark
            ? '#ffffff'
            : '#111827',

        secondary: isDark
            ? '#a1a1aa'
            : '#6b7280',

        border: isDark
            ? '#27272a'
            : '#e5e7eb',

        iconBackground: isDark
            ? '#27272a'
            : '#f1f5f9',

        primaryLight: isDark
            ? PRIMARY_LIGHT_DARK
            : PRIMARY_LIGHT,
    };

    return {
        isDark,
        colors,
    };
}