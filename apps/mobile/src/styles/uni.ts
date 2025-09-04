import { StyleSheet } from 'react-native-unistyles'

import { themes } from './themes'
import { breakpoints } from './tokens'

export const settings = {
  adaptiveThemes: true,
}

StyleSheet.configure({
  breakpoints,
  settings,
  themes,
})
