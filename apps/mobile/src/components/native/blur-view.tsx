import { BlurView as Component } from 'expo-blur'
import { withUnistyles } from 'react-native-unistyles'

export const BlurView = withUnistyles(Component, (theme) => ({
  tint: theme.variant,
}))
