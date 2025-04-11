import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { ThemeProvider } from '@react-navigation/native'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { StatusBar } from 'expo-status-bar'
import { type ReactNode, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { UnistylesRuntime } from 'react-native-unistyles'
import { IntlProvider } from 'use-intl'

import { AccountSwitcher } from '~/components/users/switcher'
import { useTheme } from '~/hooks/theme'
import { timeZone } from '~/intl'
import en from '~/intl/en.json'
import { persistOptions, queryClient } from '~/lib/query'
import { usePreferences } from '~/stores/preferences'

import { Gallery } from './gallery'
import { Toast } from './toast'

type Props = {
  children: ReactNode
}

export function Providers({ children }: Props) {
  const { theme } = usePreferences()

  useEffect(() => {
    UnistylesRuntime.setAdaptiveThemes(theme === 'acorn')

    if (theme !== 'acorn') {
      UnistylesRuntime.setTheme(theme)
    }
  }, [theme])

  return (
    <GestureHandlerRootView>
      <IntlProvider locale="en" messages={en} timeZone={timeZone}>
        <BottomSheetModalProvider>
          <KeyboardProvider>
            <ThemeProvider value={useTheme()}>
              <PersistQueryClientProvider
                client={queryClient}
                persistOptions={persistOptions}
              >
                <StatusBar
                  style={
                    theme === 'acorn'
                      ? 'auto'
                      : theme.endsWith('light')
                        ? 'dark'
                        : 'light'
                  }
                />

                {children}

                <Gallery.Root />

                <AccountSwitcher />

                <Toast />
              </PersistQueryClientProvider>
            </ThemeProvider>
          </KeyboardProvider>
        </BottomSheetModalProvider>
      </IntlProvider>
    </GestureHandlerRootView>
  )
}
