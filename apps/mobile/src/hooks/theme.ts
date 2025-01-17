import { type Theme } from '@react-navigation/native'
import { useStyles } from 'react-native-unistyles'

import { fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

export function useTheme() {
  const { fontSystem } = usePreferences()

  const { theme } = useStyles()

  const fontFamily = fontSystem ? fonts.system : fonts.sans

  return {
    colors: {
      background: theme.colors.accent.bg,
      border: theme.colors.gray.border,
      card: theme.colors.gray.bgAlt,
      notification: theme.colors.accent.accent,
      primary: theme.colors.accent.accent,
      text: theme.colors.gray.text,
    },
    dark: theme.name === 'dark',
    fonts: {
      bold: {
        fontFamily,
        fontWeight: '700',
      },
      heavy: {
        fontFamily,
        fontWeight: '800',
      },
      medium: {
        fontFamily,
        fontWeight: '500',
      },
      regular: {
        fontFamily,
        fontWeight: '400',
      },
    },
  } satisfies Theme
}
