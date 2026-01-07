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

import { Gallery } from '../gallery'
import { ThemeProvider } from '../navigation/theme'
import { HtmlProvider } from './html/provider'
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
                  <HtmlProvider>{children}</HtmlProvider>

                  <AccountSwitcher />
                  <Gallery.Root />
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
