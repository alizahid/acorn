import { StyleSheet } from 'react-native-unistyles'

import { themes } from './themes'
import { breakpoints } from './tokens'

const settings = {
  adaptiveThemes: true,
}

StyleSheet.configure({
  breakpoints,
  settings,
  themes,
})
