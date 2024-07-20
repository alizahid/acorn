import '~/styles/uni'

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { useFonts } from 'expo-font'
import { getCalendars } from 'expo-localization'
import { Slot, SplashScreen } from 'expo-router'
import { useEffect } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { IntlProvider } from 'use-intl'

import en from '~/intl/en.json'
import { fonts } from '~/lib/fonts'
import { persister, queryClient } from '~/lib/query'

void SplashScreen.preventAutoHideAsync()

const [calendar] = getCalendars()

export default function RootLayout() {
  const [loaded] = useFonts(fonts)

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={styles.main}>
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
          timeZone={calendar.timeZone ?? undefined}
        >
          <KeyboardAvoidingView
            behavior="padding"
            enabled={Platform.OS === 'ios'}
            style={styles.main}
          >
            <Slot />
          </KeyboardAvoidingView>
        </IntlProvider>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
})
