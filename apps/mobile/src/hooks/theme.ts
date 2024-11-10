import { type Theme } from '@react-navigation/native'
import { useStyles } from 'react-native-unistyles'

export function useTheme() {
  const { theme } = useStyles()

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
        fontFamily: 'sans',
        fontWeight: '700',
      },
      heavy: {
        fontFamily: 'sans',
        fontWeight: '800',
      },
      medium: {
        fontFamily: 'sans',
        fontWeight: '500',
      },
      regular: {
        fontFamily: 'sans',
        fontWeight: '400',
      },
    },
  } satisfies Theme
}
