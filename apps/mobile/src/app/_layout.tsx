import '~/styles/uni'

import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import * as SplashScreen from 'expo-splash-screen'
import {} from 'expo-video'
import { useEffect } from 'react'
import SoundPlayer from 'react-native-sound-player'
import { UnistylesRuntime } from 'react-native-unistyles'

import { Providers } from '~/components/common/providers'
import { RootLayout } from '~/components/navigation/layout'
import { db } from '~/db'
import migrations from '~/drizzle/migrations'
import { Sentry } from '~/lib/sentry'
import { usePreferences } from '~/stores/preferences'

SoundPlayer.setMixAudio(true)

void SplashScreen.preventAutoHideAsync()

function Acorn() {
  const { theme } = usePreferences()

  const { error, success } = useMigrations(db, migrations)

  useEffect(() => {
    if (success) {
      void SplashScreen.hideAsync()
    }
  }, [success])

  useEffect(() => {
    if (error) {
      Sentry.captureException(error)
    }
  }, [error])

  useEffect(() => {
    UnistylesRuntime.setAdaptiveThemes(theme === 'acorn')

    if (theme !== 'acorn') {
      UnistylesRuntime.setTheme(theme)
    }
  }, [theme])

  if (!success) {
    return null
  }

  return (
    <Providers>
      <RootLayout />
    </Providers>
  )
}

export default Sentry.wrap(Acorn)
