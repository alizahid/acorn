import { focusManager } from '@tanstack/react-query'
import { Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { AppState } from 'react-native'

import { type SignInParams } from '~/app/sign-in'
import { useAuth } from '~/stores/auth'

import { Header } from './header'

export function RootLayout() {
  const router = useRouter()

  const { accountId } = useAuth()

  useEffect(() => {
    if (!accountId) {
      router.navigate('/sign-in')
    }
  }, [accountId, router])

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
