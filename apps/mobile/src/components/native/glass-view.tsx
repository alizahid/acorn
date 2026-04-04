import {
  GlassView as Component,
  GlassContainer as ComponentContainer,
} from 'expo-glass-effect'
import { withUnistyles } from 'react-native-unistyles'

export const GlassContainer = withUnistyles(ComponentContainer)
export const GlassView = withUnistyles(Component)
