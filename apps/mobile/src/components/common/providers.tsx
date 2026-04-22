import { PortalProvider } from '@gorhom/portal'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { type ReactNode } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { IntlProvider } from 'use-intl'

import { AccountSwitcher } from '~/components/users/switcher'
import { FocusProvider } from '~/hooks/focus'
import { timeZone } from '~/intl'
import en from '~/intl/en.json'
import { persistOptions, queryClient } from '~/lib/query'

import { ImageProvider } from '../providers/image'
import { ThemeProvider } from '../providers/theme'
import { Toast } from './toast'

type Props = {
  children: ReactNode
}

export function Providers({ children }: Props) {
  return (
    <GestureHandlerRootView>
      <IntlProvider locale="en" messages={en} timeZone={timeZone}>
        <KeyboardProvider>
          <ThemeProvider>
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={persistOptions}
            >
              <PortalProvider>
                <FocusProvider>
                  <ImageProvider>{children}</ImageProvider>

                  <AccountSwitcher />
                  <Toast />
                </FocusProvider>
              </PortalProvider>
            </PersistQueryClientProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </IntlProvider>
    </GestureHandlerRootView>
  )
}
