import { osVersion } from 'expo-device'
import { isLiquidGlassAvailable } from 'expo-glass-effect'
import { Platform } from 'react-native'
import semver from 'semver'

export const cardMaxWidth = 700

const version = semver.coerce(osVersion) ?? '0'

export const iPad =
  Platform.OS === 'ios' && (Platform.isPad || Platform.isMacCatalyst)

export const glass = isLiquidGlassAvailable()

export const iOS26 = Platform.OS === 'ios' && semver.gte(version, '26.0.0')

export const heights = {
  floatingButton: 80,
  header: glass ? 54 : 48,
  notifications: 56,
  search: 112,
  tabBar: glass ? 64 : 54,
} as const
