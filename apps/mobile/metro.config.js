import { getSentryExpoConfig } from '@sentry/react-native/metro.js'

const config = getSentryExpoConfig(import.meta.dirname)

config.resolver.sourceExts.push('sql')

const originalResolveRequest = config.resolver.resolveRequest

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@react-navigation/core') {
    return context.resolveRequest(
      context,
      'expo-router/react-navigation',
      platform,
    )
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform)
  }

  return context.resolveRequest(context, moduleName, platform)
}

export default config
