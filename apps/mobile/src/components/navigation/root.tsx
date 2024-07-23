import { Stack } from 'expo-router'
import { useEffect } from 'react'
import { useTranslations } from 'use-intl'

import { useAuth } from '~/stores/auth'

import { Header } from './header'

export function Root() {
  const t = useTranslations('screen.home')

  const { expired, refresh } = useAuth()

  useEffect(() => {
    if (expired) {
      void refresh()
    }
  }, [expired, refresh])

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
