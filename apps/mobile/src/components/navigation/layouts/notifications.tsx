import { Stack } from 'expo-router'
import { useTranslations } from 'use-intl'

import { Header } from '~/components/navigation/header'
import { useMarkAllAsRead } from '~/hooks/mutations/users/notifications'

import { HeaderButton } from '../header-button'

export function NotificationsLayout() {
  const t = useTranslations('screen')

  const { isPending, markAll } = useMarkAllAsRead()

  return (
    <Stack
      screenOptions={{
        fullScreenGestureEnabled: true,
        header: (props) => <Header {...props} />,
      }}
    >
      <Stack.Screen
        name="notifications"
        options={{
          headerRight: () => (
            <HeaderButton
              icon="CheckCircle"
              loading={isPending}
              onPress={() => {
                markAll()
              }}
            />
          ),
          title: t('notifications.title'),
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
