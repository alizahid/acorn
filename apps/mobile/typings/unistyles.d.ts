import {
  type darkTheme,
  type indigoDark,
  type indigoLight,
  type jadeDark,
  type jadeLight,
  type lightTheme,
  type plumDark,
  type plumLight,
  type rubyDark,
  type rubyLight,
} from '~/styles/themes'
import { type breakpoints } from '~/styles/tokens'

type AppBreakpoints = typeof breakpoints

type AppThemes = {
  acornDark: typeof darkTheme
  acornLight: typeof lightTheme
  dark: typeof darkTheme
  indigoDark: typeof indigoDark
  indigoLight: typeof indigoLight
  jadeDark: typeof jadeDark
  jadeLight: typeof jadeLight
  light: typeof lightTheme
  plumDark: typeof plumDark
  plumLight: typeof plumLight
  rubyDark: typeof rubyDark
  rubyLight: typeof rubyLight
}

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface -- go away
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface -- go away
  export interface UnistylesThemes extends AppThemes {}
}
