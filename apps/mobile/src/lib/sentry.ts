// biome-ignore lint/performance/noNamespaceImport: go away
// biome-ignore lint/style/noExportedImports: go away
import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: !__DEV__ && Boolean(process.env.EXPO_PUBLIC_SENTRY_DSN),
  ignoreErrors: [
    /can't do that while banned/iu,
    /connection appears to be offline/iu,
    /network connection was lost/iu,
    /network request failed/iu,
    /this thing is archived and may no longer be voted on/iu,
  ],
  maxValueLength: 10_000,
  tracesSampleRate: 0.001,
})

export { Sentry }
