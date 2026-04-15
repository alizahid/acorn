import { isLiquidGlassAvailable } from 'expo-glass-effect'
import { Platform } from 'react-native'

export const cardMaxWidth = 700

export const iPad =
  Platform.OS === 'ios' && (Platform.isPad || Platform.isMacCatalyst)

export const glass = isLiquidGlassAvailable()

export const iOS26 =
  Platform.OS === 'ios' && Number.parseInt(String(Platform.Version), 10) >= 26

export const tints = {
  dark: 'systemThickMaterialDark',
  light: 'systemThickMaterialLight',
} as const

export const heights = {
  floatingButton: 80,
  header: 48,
  notifications: 56,
  search: 112,
  tabBar: 48,
} as const
