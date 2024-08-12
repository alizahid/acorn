import '~/styles/uni'

import { ThemeProvider } from '@react-navigation/native'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { useFonts } from 'expo-font'
import { getCalendars } from 'expo-localization'
import { SplashScreen } from 'expo-router'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { IntlProvider } from 'use-intl'

import { Root } from '~/components/navigation/root'
import { useTheme } from '~/hooks/theme'
import en from '~/intl/en.json'
import { fonts } from '~/lib/fonts'
import { persister, queryClient } from '~/lib/query'
import { Sentry } from '~/lib/sentry'

void SplashScreen.preventAutoHideAsync()

const [calendar] = getCalendars()

function Acorn() {
  const [loaded] = useFonts(fonts)

  const theme = useTheme()

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={theme}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            persister,
          }}
        >
          <IntlProvider
            locale="en"
            messages={en}
            now={new Date()}
            timeZone={calendar?.timeZone ?? undefined}
          >
            <Root />
          </IntlProvider>
        </PersistQueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}

export default Sentry.wrap(Acorn)
