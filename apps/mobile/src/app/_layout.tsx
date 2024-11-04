import '~/styles/uni'
import '~/sheets'

import { ThemeProvider } from '@react-navigation/native'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { getCalendars } from 'expo-localization'
import { SQLiteProvider } from 'expo-sqlite'
import { SheetProvider } from 'react-native-actions-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { IntlProvider } from 'use-intl'

import { RootLayout } from '~/components/navigation/layout'
import { useTheme } from '~/hooks/theme'
import en from '~/intl/en.json'
import { databaseName, onInit } from '~/lib/db'
import { persister, queryClient } from '~/lib/query'
import { Sentry } from '~/lib/sentry'

function Acorn() {
  const theme = useTheme()

  const [calendar] = getCalendars()

  return (
    <SQLiteProvider databaseName={databaseName} onInit={onInit}>
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
                <SheetProvider>
                  <RootLayout />
                </SheetProvider>
              </IntlProvider>
            </PersistQueryClientProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SQLiteProvider>
  )
}

export default Sentry.wrap(Acorn)
