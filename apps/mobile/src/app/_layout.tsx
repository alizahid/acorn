import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { Slot } from 'expo-router'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { UnistylesRuntime } from 'react-native-unistyles'
import { useShallow } from 'zustand/react/shallow'

import { Providers } from '~/components/common/providers'
import { Drawer } from '~/components/navigation/drawer'
import { db } from '~/db'
import migrations from '~/drizzle/migrations'
import { Sentry } from '~/lib/sentry'
import { setAdaptiveTheme } from '~/lib/theme'
import { usePreferences } from '~/stores/preferences'

SplashScreen.preventAutoHideAsync()

function Acorn() {
  const { error, success } = useMigrations(db, migrations)

  const { theme } = usePreferences(
    useShallow((state) => ({
      theme: state.theme,
    })),
  )

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
      <Drawer>
        <Slot />
      </Drawer>
    </Providers>
  )
}

export default Sentry.wrap(Acorn)
