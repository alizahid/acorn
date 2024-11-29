import { focusManager } from '@tanstack/react-query'
import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { AppState } from 'react-native'

import { type SignInParams } from '~/app/sign-in'
import { queryClient } from '~/lib/query'
import { Sentry } from '~/lib/sentry'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'

import { Header } from './header'

export function RootLayout() {
  const router = useRouter()

  const { accountId } = useAuth()
  const { refreshInterval } = usePreferences()

  useEffect(() => {
    if (!accountId) {
      router.navigate('/sign-in')
    }
  }, [accountId, router])

  useEffect(() => {
    queryClient.setDefaultOptions({
      mutations: {
        throwOnError(error) {
          if (__DEV__) {
            // eslint-disable-next-line no-console -- dev
            console.log(error)
          }

          Sentry.captureException(error)

          return false
        },
      },
      queries: {
        gcTime: refreshInterval,
        retry: false,
        staleTime: refreshInterval,
        throwOnError(error) {
          if (__DEV__) {
            // eslint-disable-next-line no-console -- dev
            console.log(error)
          }

          Sentry.captureException(error)

          return false
        },
      },
    })
  }, [refreshInterval])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active')
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return (
    <Stack
      screenOptions={{
        fullScreenGestureEnabled: true,
        header: (props) => <Header {...props} />,
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="sign-in"
        options={(props) => ({
          gestureEnabled:
            (props.route.params as SignInParams).mode === 'dismissible',
          headerShown: false,
          presentation: 'modal',
        })}
      />
    </Stack>
  )
}
