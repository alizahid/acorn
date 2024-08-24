import { focusManager } from '@tanstack/react-query'
import { Stack, useFocusEffect, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { AppState } from 'react-native'

import { useAuth } from '~/stores/auth'

import { Header } from './header'

export function Root() {
  const router = useRouter()

  const { accountId } = useAuth()

  useFocusEffect(() => {
    if (!accountId) {
      router.navigate('/sign-in')
    }
  })

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
        options={{
          gestureEnabled: false,
          headerShown: false,
          presentation: 'modal',
        }}
      />

      <Stack.Screen name="communities/[name]/search" />
    </Stack>
  )
}
