import { getSentryExpoConfig } from '@sentry/react-native/metro.js'
import { withUnistylesConfig } from 'react-native-unistyles/metro'

const config = getSentryExpoConfig(import.meta.dirname)

config.resolver.sourceExts.push('sql')

export default withUnistylesConfig(config)
