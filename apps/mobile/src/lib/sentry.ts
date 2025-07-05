// biome-ignore lint/performance/noNamespaceImport: go away
// biome-ignore lint/style/noExportedImports: go away
import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn: String(process.env.EXPO_PUBLIC_SENTRY_DSN),
  // biome-ignore lint/correctness/noUndeclaredVariables: go away
  enabled: !__DEV__ && Boolean(process.env.EXPO_PUBLIC_SENTRY_DSN),
  maxValueLength: 10_000,
  tracesSampleRate: 0.001,
})

export { Sentry }
