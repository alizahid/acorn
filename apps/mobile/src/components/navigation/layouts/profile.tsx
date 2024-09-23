import { Stack } from 'expo-router'
import { useTranslations } from 'use-intl'

import { Header } from '~/components/navigation/header'
import { AccountSwitchCard } from '~/components/users/switch'
import { useAuth } from '~/stores/auth'

export function ProfileLayout() {
  const t = useTranslations('screen')

  const { accountId } = useAuth()

  return (
    <Stack
      screenOptions={{
        fullScreenGestureEnabled: true,
        header: (props) => <Header {...props} />,
      }}
    >
      <Stack.Screen
        name="profile"
        options={{
          headerRight: () => <AccountSwitchCard />,
          title: accountId,
        }}
      />

      <Stack.Screen
        name="posts/[id]/reply"
        options={{
          presentation: 'modal',
          title: t('posts.reply.title'),
        }}
      />
    </Stack>
  )
}
