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
      background: theme.colors.gray[1],
      border: theme.colors.gray[6],
      card: theme.colors.gray[2],
      notification: theme.colors.accent.a9,
      primary: theme.colors.accent.a9,
      text: theme.colors.gray[11],
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
