import { ThemeProvider as Provider } from '@react-navigation/native'
import { type ReactNode } from 'react'
import { withUnistyles } from 'react-native-unistyles'

import { fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

const Component = withUnistyles(Provider)

type Props = {
  children: ReactNode
}

export function ThemeProvider({ children }: Props) {
  const { font, themeOled, themeTint } = usePreferences([
    'font',
    'themeOled',
    'themeTint',
  ])

  return (
    <Component
      uniProps={(theme) => ({
        value: {
          colors: {
            background: themeOled
              ? oledTheme[theme.variant].bg
              : themeTint
                ? theme.colors.accent.bg
                : theme.colors.gray.bg,
            border: theme.colors.gray.border,
            card: theme.colors.gray.bgAlt,
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
