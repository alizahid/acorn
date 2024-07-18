import type { breakpoints, darkTheme, lightTheme } from '~/styles/tokens'

type AppBreakpoints = typeof breakpoints

type AppThemes = {
  light: typeof lightTheme
  dark: typeof darkTheme
}

declare module 'react-native-unistyles' {
  // eslint-disable-next-line ts/consistent-type-definitions
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  // eslint-disable-next-line ts/consistent-type-definitions
  export interface UnistylesThemes extends AppThemes {}
}
