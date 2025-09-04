import { SymbolView as Component } from 'expo-symbols'
import { withUnistyles } from 'react-native-unistyles'

export const SymbolIcon = withUnistyles(Component, (theme) => ({
  size: theme.space[5],
  tintColor: theme.colors.accent.accent,
}))
