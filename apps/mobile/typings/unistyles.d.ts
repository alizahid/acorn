import { type darkTheme, type lightTheme } from '~/styles/themes'
import { type breakpoints } from '~/styles/tokens'

type AppBreakpoints = typeof breakpoints

type AppThemes = {
  dark: typeof darkTheme
  light: typeof lightTheme
}

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface -- go away
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface -- go away
  export interface UnistylesThemes extends AppThemes {}
}
