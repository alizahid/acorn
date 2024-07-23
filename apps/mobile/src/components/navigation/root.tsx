import { Stack } from 'expo-router'
import { useTranslations } from 'use-intl'

import { Header } from './header'

export function Root() {
  const t = useTranslations('screen.home')

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
          title: t('title'),
        }}
      />
    </Stack>
  )
}
