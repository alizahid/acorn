import '~/styles/uni'

import { ThemeProvider } from '@react-navigation/native'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { SQLiteProvider } from 'expo-sqlite'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { UnistylesRuntime } from 'react-native-unistyles'
import { IntlProvider } from 'use-intl'

import { Feedback } from '~/components/common/feedback'
import { RootLayout } from '~/components/navigation/layout'
import { Sheets } from '~/components/sheets'
import { useTheme } from '~/hooks/theme'
import { timeZone } from '~/intl'
import en from '~/intl/en.json'
import { databaseName, onInit } from '~/lib/db'
import { persister, queryClient } from '~/lib/query'
import { Sentry } from '~/lib/sentry'
import { usePreferences } from '~/stores/preferences'

function Acorn() {
  const { theme } = usePreferences()

  useEffect(() => {
    UnistylesRuntime.setAdaptiveThemes(theme === 'acorn')

    if (theme !== 'acorn') {
      UnistylesRuntime.setTheme(theme)
    }
  }, [theme])

  return (
    <SQLiteProvider databaseName={databaseName} onInit={onInit}>
      <StatusBar
        style={
          theme === 'acorn'
            ? 'auto'
            : theme.endsWith('Light')
              ? 'dark'
              : 'light'
        }
      />

      <GestureHandlerRootView>
        <KeyboardProvider>
          <ThemeProvider value={useTheme()}>
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
                timeZone={timeZone}
              >
                <RootLayout />

                <Sheets />
                <Feedback />
              </IntlProvider>
            </PersistQueryClientProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SQLiteProvider>
  )
}

export default Sentry.wrap(Acorn)
