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

import { MediaMenu } from '../common/media-menu'
import { Toast } from '../common/toast'
import { PurchaseProvider } from './purchases'
import { ThemeProvider } from './theme'

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
              <FocusProvider>
                {children}

                <MediaMenu />
                <AccountSwitcher />
                <PurchaseProvider />
                <Toast />
              </FocusProvider>
            </PersistQueryClientProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </IntlProvider>
    </GestureHandlerRootView>
  )
}
