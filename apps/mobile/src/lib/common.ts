import Constants from 'expo-constants'
import { osVersion } from 'expo-device'
import { isLiquidGlassAvailable } from 'expo-glass-effect'
import { Platform } from 'react-native'
import semver from 'semver'

const version = semver.coerce(osVersion) ?? '0'

export const iPad =
  Platform.OS === 'ios' && (Platform.isPad || Platform.isMacCatalyst)

export const glass = isLiquidGlassAvailable()

export const iOS26 = Platform.OS === 'ios' && semver.gte(version, '26.0.0')

export const acornBuild = Number(Constants.expoConfig?.ios?.buildNumber ?? 0)
