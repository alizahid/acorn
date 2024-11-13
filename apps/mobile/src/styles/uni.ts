import { UnistylesRegistry } from 'react-native-unistyles'

import {
  darkTheme,
  indigoDark,
  indigoLight,
  jadeDark,
  jadeLight,
  lightTheme,
  plumDark,
  plumLight,
  rubyDark,
  rubyLight,
} from './themes'
import { breakpoints } from './tokens'

UnistylesRegistry.addBreakpoints(breakpoints)
  .addThemes({
    acornDark: darkTheme,
    acornLight: lightTheme,
    dark: darkTheme,
    indigoDark,
    indigoLight,
    jadeDark,
    jadeLight,
    light: lightTheme,
    plumDark,
    plumLight,
    rubyDark,
    rubyLight,
  })
  .addConfig({
    adaptiveThemes: true,
  })
