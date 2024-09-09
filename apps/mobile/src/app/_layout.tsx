import '~/styles/uni'

import { ThemeProvider } from '@react-navigation/native'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { getCalendars } from 'expo-localization'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { IntlProvider } from 'use-intl'

import { Root } from '~/components/navigation/root'
import { useTheme } from '~/hooks/theme'
import en from '~/intl/en.json'
import { persister, queryClient } from '~/lib/query'
import { Sentry } from '~/lib/sentry'

const [calendar] = getCalendars()

function Acorn() {
  const theme = useTheme()

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
