import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn: String(process.env.EXPO_PUBLIC_SENTRY_DSN),
  enabled: !__DEV__ && Boolean(process.env.EXPO_PUBLIC_SENTRY_DSN),
  maxValueLength: 10_000,
  tracesSampleRate: 0.001,
})

export { Sentry }
