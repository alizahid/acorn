import { UnistylesRuntime } from 'react-native-unistyles'

import { type Theme, themes } from '~/styles/themes'

export function getThemeName(theme: Theme) {
  return theme.split('-')[0] as 'acorn' | 'ruby' | 'plum' | 'indigo' | 'jade'
}

export function setAdaptiveTheme(theme: Theme) {
  const name = getThemeName(theme)

  UnistylesRuntime.updateTheme('light', () => themes[`${name}-light`])
  UnistylesRuntime.updateTheme('dark', () => themes[`${name}-dark`])
}
