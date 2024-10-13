import { Stack } from 'expo-router'
import { useTranslations } from 'use-intl'

import { Header } from '~/components/navigation/header'
import { AccountSwitchCard } from '~/components/users/switch'
import { useAuth } from '~/stores/auth'

import { type CommunityParams } from '../screens/communities/community'
import { type CommunitiesSearchParams } from '../screens/communities/search'
import { type UserPostsParams } from '../screens/users/posts'
import { type UserParams } from '../screens/users/user'

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
        name="users/[name]/[type]"
        options={(props) => ({
          title: t(
            `profile.data.${(props.route.params as UserPostsParams).type}`,
          ),
        })}
      />

      <Stack.Screen
        name="users/[name]/comments"
        options={{
          title: t('profile.data.comments'),
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

      <Stack.Screen
        name="settings"
        options={{
          title: t('settings.title'),
        }}
      />
    </Stack>
  )
}
