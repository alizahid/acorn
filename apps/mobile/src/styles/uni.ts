import { UnistylesRegistry } from 'react-native-unistyles'

import { breakpoints, darkTheme, lightTheme } from './tokens'

UnistylesRegistry
  .addBreakpoints(breakpoints)
  .addThemes({
    dark: darkTheme,
    light: lightTheme,
  })
  .addConfig({
    adaptiveThemes: true,
    initialTheme: 'dark',
  })
