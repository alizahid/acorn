import { TextInput as Component, type TextInputInstance } from 'react-native'
import { withUnistyles } from 'react-native-unistyles'

export type TextInput = TextInputInstance
export const TextInput = withUnistyles(Component, (theme) => ({
  placeholderTextColor: theme.colors.gray.accent,
  selectionColor: theme.colors.accent.accent,
}))
