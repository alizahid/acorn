import { Stack } from 'expo-router'
import { useTranslations } from 'use-intl'

import { StackHeader } from '~/components/navigation/stack-header'
import { UserSwitcher } from '~/components/users/switcher'
import { type UserPostsParams } from '~/screens/users/posts'
import { useAuth } from '~/stores/auth'

export function ProfileLayout() {
  const t = useTranslations('screen')

  const { accountId } = useAuth()

  return (
    <Stack
      screenOptions={{
        fullScreenGestureEnabled: true,
        header: (props) => <StackHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="profile"
        options={{
          headerRight: () => <UserSwitcher />,
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
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="communities/[name]/search"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="users/[name]/index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="posts/[id]/reply"
        options={{
          presentation: 'modal',
          title: t('posts.reply.title'),
        }}
      />

      <Stack.Screen
        name="settings/about"
        options={{
          title: t('settings.about.title'),
        }}
      />

      <Stack.Screen
        name="settings/defaults"
        options={{
          title: t('settings.defaults.title'),
        }}
      />

      <Stack.Screen
        name="settings/cache"
        options={{
          title: t('settings.cache.title'),
        }}
      />

      <Stack.Screen
        name="settings/gestures"
        options={{
          title: t('settings.gestures.title'),
        }}
      />

      <Stack.Screen
        name="settings/preferences"
        options={{
          title: t('settings.preferences.title'),
        }}
      />

      <Stack.Screen
        name="settings/sort"
        options={{
          title: t('settings.sort.title'),
        }}
      />

      <Stack.Screen
        name="settings/themes"
        options={{
          title: t('settings.themes.title'),
        }}
      />
    </Stack>
  )
}
