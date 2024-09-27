import '~/styles/uni'

import { ThemeProvider } from '@react-navigation/native'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { getCalendars } from 'expo-localization'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { IntlProvider } from 'use-intl'

import { RootLayout } from '~/components/navigation/layout'
import { useTheme } from '~/hooks/theme'
import en from '~/intl/en.json'
import { persister, queryClient } from '~/lib/query'
import { Sentry } from '~/lib/sentry'

function Acorn() {
  const theme = useTheme()

  const [calendar] = getCalendars()

  return (
    <GestureHandlerRootView>
      <KeyboardProvider>
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
              <RootLayout />
            </IntlProvider>
          </PersistQueryClientProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  )
}

export default Sentry.wrap(Acorn)
