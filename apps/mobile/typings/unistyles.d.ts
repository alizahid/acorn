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
  'acorn-dark': typeof darkTheme
  'acorn-light': typeof lightTheme
  dark: typeof darkTheme
  'indigo-dark': typeof indigoDark
  'indigo-light': typeof indigoLight
  'jade-dark': typeof jadeDark
  'jade-light': typeof jadeLight
  light: typeof lightTheme
  'plum-dark': typeof plumDark
  'plum-light': typeof plumLight
  'ruby-dark': typeof rubyDark
  'ruby-light': typeof rubyLight
}

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface -- go away
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface -- go away
  export interface UnistylesThemes extends AppThemes {}
}
