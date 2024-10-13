import { Stack } from 'expo-router'
import { useTranslations } from 'use-intl'

import { Header } from '~/components/navigation/header'

import { type CommunityParams } from '../screens/communities/community'
import { type CommunitiesSearchParams } from '../screens/communities/search'
import { type UserParams } from '../screens/users/user'

export function CommunitiesLayout() {
  const t = useTranslations('screen')

  return (
    <Stack
      screenOptions={{
        fullScreenGestureEnabled: true,
        header: (props) => <Header {...props} />,
      }}
    >
      <Stack.Screen
        name="communities"
        options={{
          title: t('communities.title'),
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
