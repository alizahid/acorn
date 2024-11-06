import { UnistylesRegistry } from 'react-native-unistyles'

import { darkTheme, lightTheme } from './themes'
import { breakpoints } from './tokens'

UnistylesRegistry.addBreakpoints(breakpoints)
  .addThemes({
    dark: darkTheme,
    light: lightTheme,
  })
  .addConfig({
    adaptiveThemes: true,
  })
