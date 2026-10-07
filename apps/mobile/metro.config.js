import { getSentryExpoConfig } from '@sentry/react-native/metro.js'

const config = getSentryExpoConfig(import.meta.dirname)

config.resolver.sourceExts.push('sql')

export default config
