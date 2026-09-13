// biome-ignore lint/performance/noNamespaceImport: go away
// biome-ignore lint/style/noExportedImports: go away
import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: !__DEV__ && Boolean(process.env.EXPO_PUBLIC_SENTRY_DSN),
  ignoreErrors: [
    /can't do that while banned/i,
    /connection appears to be offline/i,
    /network connection was lost/i,
    /network request failed/i,
    /this thing is archived and may no longer be voted on/i,
  ],
  maxValueLength: 10_000,
  tracesSampleRate: 0.001,
})

export { Sentry }
