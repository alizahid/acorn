import { SymbolView } from 'expo-symbols'
import { withUnistyles } from 'react-native-unistyles'

export const SFSymbol = withUnistyles(SymbolView, (theme) => ({
  size: theme.space[5],
  tintColor: theme.colors.accent.accent,
}))
