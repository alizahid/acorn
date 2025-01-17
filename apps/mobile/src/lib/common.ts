import { type BlurTint } from 'expo-blur'
import { Platform } from 'react-native'

export const cardMaxWidth = 700

export const iPhone = Platform.OS === 'ios' && !Platform.isPad
export const iPad = Platform.OS === 'ios' && Platform.isPad

export const swipeActionThreshold = {
  long: iPad ? 0.2 : 0.4,
  short: iPad ? 0.1 : 0.2,
} as const

export const tintDark: BlurTint = 'systemThickMaterialDark'
export const tintLight: BlurTint = 'systemThickMaterialLight'

export const modalStyle = iPad
  ? {
      maxHeight: 640,
      maxWidth: 580,
    }
  : undefined
