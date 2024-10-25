import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn: String(process.env.EXPO_PUBLIC_SENTRY_DSN),
  enabled: Boolean(process.env.EXPO_PUBLIC_SENTRY_DSN),
  tracesSampleRate: 0.01,
})

export { Sentry }
