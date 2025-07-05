import '~/styles/uni'

import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { Slot } from 'expo-router'
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen'
import { useEffect } from 'react'
import SoundPlayer from 'react-native-sound-player'
import { UnistylesRuntime } from 'react-native-unistyles'

import { Providers } from '~/components/common/providers'
import { db } from '~/db'
import migrations from '~/drizzle/migrations'
import { Sentry } from '~/lib/sentry'
import { usePreferences } from '~/stores/preferences'

SoundPlayer.setMixAudio(true)

preventAutoHideAsync()

function Acorn() {
  const { theme } = usePreferences()

  const { error, success } = useMigrations(db, migrations)

  useEffect(() => {
    if (success) {
      hideAsync()
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
      <Slot />
    </Providers>
  )
}

export default Sentry.wrap(Acorn)
