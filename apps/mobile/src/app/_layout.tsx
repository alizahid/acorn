import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { Slot } from 'expo-router'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { UnistylesRuntime } from 'react-native-unistyles'

import { Providers } from '~/components/common/providers'
import { db } from '~/db'
import migrations from '~/drizzle/migrations'
import { Sentry } from '~/lib/sentry'
import { setAdaptiveTheme } from '~/lib/theme'
import { usePreferences } from '~/stores/preferences'

SplashScreen.preventAutoHideAsync()

function Acorn() {
  const { theme } = usePreferences()

  const { error, success } = useMigrations(db, migrations)

  useEffect(() => {
    if (success) {
      SplashScreen.hideAsync()
    }
  }, [success])

  useEffect(() => {
    if (error) {
      Sentry.captureException(error)
    }
  }, [error])

  useEffect(() => {
    const adaptive = !(theme.endsWith('light') || theme.endsWith('dark'))

    UnistylesRuntime.setAdaptiveThemes(adaptive)

    if (adaptive) {
      setAdaptiveTheme(theme)
    } else {
      UnistylesRuntime.setTheme(theme)
    }
  }, [theme])

  if (!success) {
    return null
  }

  return (
    <Providers>
      <Slot />
    </Providers>
  )
}

export default Sentry.wrap(Acorn)
