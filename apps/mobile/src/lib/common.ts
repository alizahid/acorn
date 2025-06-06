import { type BlurTint } from 'expo-blur'
import { Platform, StyleSheet } from 'react-native'

export const cardMaxWidth = 700

export const iPhone = Platform.OS === 'ios' && !Platform.isPad
export const iPad = Platform.OS === 'ios' && Platform.isPad

export const swipeActionThreshold = {
  long: iPad ? 0.2 : 0.4,
  short: iPad ? 0.1 : 0.2,
} as const

export const tintDark: BlurTint = 'systemThickMaterialDark'
export const tintLight: BlurTint = 'systemThickMaterialLight'

export const heights = {
  floatingButton: 80,
  header: 48 + StyleSheet.hairlineWidth,
  notifications: 56,
  search: 112,
  tabBar: 48 + StyleSheet.hairlineWidth,
} as const
