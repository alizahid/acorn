import { BlurView as Component } from 'expo-blur'
import { withUnistyles } from 'react-native-unistyles'

export const BlurView = withUnistyles(Component, () => ({
  intensity: 75,
  tint: 'systemChromeMaterial' as const,
}))
