import 'react-native-reanimated'
import '~/styles/uni'

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { getCalendars } from 'expo-localization'
import { Stack } from 'expo-router'
import { IntlProvider } from 'use-intl'

import en from '~/intl/en.json'
import { persister, queryClient } from '~/lib/query'

const [calendar] = getCalendars()

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
      }}
    >
      <IntlProvider locale="en" messages={en} now={new Date()} timeZone={calendar.timeZone ?? undefined}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </IntlProvider>
    </PersistQueryClientProvider>
  )
}
