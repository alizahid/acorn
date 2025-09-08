import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { StatusBar } from 'expo-status-bar'
import { type ReactNode } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { IntlProvider } from 'use-intl'

import { AccountSwitcher } from '~/components/users/switcher'
import { FocusProvider } from '~/hooks/focus'
import { timeZone } from '~/intl'
import en from '~/intl/en.json'
import { persistOptions, queryClient } from '~/lib/query'
import { usePreferences } from '~/stores/preferences'

import { ThemeProvider } from '../navigation/theme'
import { Gallery } from './gallery'
import { Toast } from './toast'

type Props = {
  children: ReactNode
}

export function Providers({ children }: Props) {
  const { theme } = usePreferences()

  return (
    <GestureHandlerRootView>
      <IntlProvider locale="en" messages={en} timeZone={timeZone}>
        <KeyboardProvider>
          <ThemeProvider>
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={persistOptions}
            >
              <StatusBar
                style={
                  theme.endsWith('light')
                    ? 'dark'
                    : theme.endsWith('dark')
                      ? 'light'
                      : 'auto'
                }
              />

              <FocusProvider>
                {children}

                <Gallery.Root />

                <AccountSwitcher />

                <Toast />
              </FocusProvider>
            </PersistQueryClientProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </IntlProvider>
    </GestureHandlerRootView>
  )
}
