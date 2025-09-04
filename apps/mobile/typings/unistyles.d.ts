import { type themes } from '~/styles/themes'
import { type breakpoints } from '~/styles/tokens'

type AppThemes = typeof themes
type AppBreakpoints = typeof breakpoints

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}
