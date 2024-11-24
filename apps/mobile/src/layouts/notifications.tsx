import { Stack } from 'expo-router'
import { useTranslations } from 'use-intl'

import { Header } from '~/components/navigation/header'
import { HeaderButton } from '~/components/navigation/header-button'
import { useMarkAllAsRead } from '~/hooks/mutations/users/notifications'
import { type CommunityParams } from '~/screens/communities/community'
import { type CommunitiesSearchParams } from '~/screens/communities/search'
import { type UserParams } from '~/screens/users/user'

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
        name="communities/[name]/index"
        options={(props) => ({
          title: (props.route.params as CommunityParams).name,
        })}
      />

      <Stack.Screen
        name="communities/[name]/search"
        options={(props) => ({
          title: (props.route.params as CommunitiesSearchParams).name,
        })}
      />

      <Stack.Screen
        name="users/[name]/index"
        options={(props) => ({
          title: (props.route.params as UserParams).name,
        })}
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
