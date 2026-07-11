import { ThemeProvider as Provider } from 'expo-router/react-navigation'
import { type ReactNode } from 'react'
import { withUnistyles } from 'react-native-unistyles'

import { fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

const Component = withUnistyles(Provider)

type Props = {
  children: ReactNode
}

export function ThemeProvider({ children }: Props) {
  const { font } = usePreferences((state) => ({
    font: state.font,
  }))

  return (
    <Component
      uniProps={(theme) => ({
        value: {
          colors: {
            background: theme.colors.ui.bg,
            border: theme.colors.gray.border,
            card: theme.colors.gray.bg,
            notification: theme.colors.accent.accent,
            primary: theme.colors.accent.accent,
            text: theme.colors.gray.text,
          },
          dark: theme.variant === 'dark',
          fonts: {
            bold: {
              fontFamily: fonts[font],
              fontWeight: '700',
            },
            heavy: {
              fontFamily: fonts[font],
              fontWeight: '800',
            },
            medium: {
              fontFamily: fonts[font],
              fontWeight: '500',
            },
            regular: {
              fontFamily: fonts[font],
              fontWeight: '400',
            },
          },
        },
      })}
    >
      {children}
    </Component>
  )
}
