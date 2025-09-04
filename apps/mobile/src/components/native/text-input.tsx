import { TextInput as Component } from 'react-native'
import { withUnistyles } from 'react-native-unistyles'

export type TextInput = Component
export const TextInput = withUnistyles(Component, (theme) => ({
  placeholderTextColor: theme.colors.gray.accent,
  selectionColor: theme.colors.accent.accent,
}))
