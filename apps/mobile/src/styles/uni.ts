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
    'acorn-dark': darkTheme,
    'acorn-light': lightTheme,
    dark: darkTheme,
    'indigo-dark': indigoDark,
    'indigo-light': indigoLight,
    'jade-dark': jadeDark,
    'jade-light': jadeLight,
    light: lightTheme,
    'plum-dark': plumDark,
    'plum-light': plumLight,
    'ruby-dark': rubyDark,
    'ruby-light': rubyLight,
  })
  .addConfig({
    adaptiveThemes: true,
  })
