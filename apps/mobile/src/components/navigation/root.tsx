import { Stack, useFocusEffect, useRouter } from 'expo-router'
import { useEffect } from 'react'

import { useAuth } from '~/stores/auth'

import { Header } from './header'

export function Root() {
  const router = useRouter()

  const { accessToken, expired, refresh } = useAuth()

  useEffect(() => {
    if (accessToken && expired) {
      void refresh()
    }
  }, [accessToken, expired, refresh])

  useFocusEffect(() => {
    if (!accessToken) {
      router.navigate('/sign-in')
    }
  })

  return (
    <Stack
      screenOptions={{
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
    </Stack>
  )
}
