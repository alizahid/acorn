import { isLiquidGlassAvailable } from 'expo-glass-effect'
import { Platform, StyleSheet } from 'react-native'

export const testFlight = process.env.EXPO_PUBLIC_TEST_FLIGHT === 'true'

export const cardMaxWidth = 700

export const iPhone =
  Platform.OS === 'ios' &&
  !Platform.isPad &&
  !Platform.isTV &&
  !Platform.isVision &&
  !Platform.isMacCatalyst

export const iPad =
  Platform.OS === 'ios' && (Platform.isPad || Platform.isMacCatalyst)

export const glass = isLiquidGlassAvailable()

export const tints = {
  dark: 'systemThickMaterialDark',
  light: 'systemThickMaterialLight',
} as const

export const heights = {
  floatingButton: 80,
  header: 48 + StyleSheet.hairlineWidth,
  notifications: 56,
  search: 112,
  tabBar: 48 + StyleSheet.hairlineWidth,
} as const
