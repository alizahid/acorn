import { Stack, useFocusEffect, useRouter } from 'expo-router'

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
    </Stack>
  )
}
