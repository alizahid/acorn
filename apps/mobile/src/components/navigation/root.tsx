import { Stack } from 'expo-router'

import { Header } from './header'

export function Root() {
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
