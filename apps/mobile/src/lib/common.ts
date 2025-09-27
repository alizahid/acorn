import { Platform, StyleSheet } from 'react-native'

export const cardMaxWidth = 700

export const iPhone =
  Platform.OS === 'ios' &&
  !Platform.isPad &&
  !Platform.isTV &&
  !Platform.isVision &&
  !Platform.isMacCatalyst

export const iPad =
  Platform.OS === 'ios' && (Platform.isPad || Platform.isMacCatalyst)

export const iOS = Number(Platform.Version)

export const isGlass = iOS > 26

export const swipeActionThreshold = {
  long: iPad ? 0.2 : 0.4,
  short: iPad ? 0.1 : 0.2,
} as const

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
