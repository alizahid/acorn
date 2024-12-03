import { Stack } from 'expo-router'
import { type PropsWithChildren } from 'react'
import { useTranslations } from 'use-intl'

import { StackHeader } from '~/components/navigation/stack-header'
import { UserSwitcher } from '~/components/users/switcher'
import { useAuth } from '~/stores/auth'

import { type UserPostsParams } from './users/[name]/[type]'

type Props = {
  segment:
    | '(home)'
    | '(search)'
    | '(profile)'
    | '(notifications)'
    | '(settings)'
}

export default function Layout({ segment }: Props) {
  const t = useTranslations('screen')

  const { accountId } = useAuth()

  if (segment === '(search)') {
    return (
      <StackLayout>
        <Stack.Screen
          name="search"
          options={{
            headerShown: false,
          }}
        />
      </StackLayout>
    )
  }

  if (segment === '(profile)') {
    return (
      <StackLayout>
        <Stack.Screen
          name="profile"
          options={{
            headerRight: () => <UserSwitcher />,
            title: accountId,
          }}
        />
      </StackLayout>
    )
  }

  if (segment === '(notifications)') {
    return (
      <StackLayout>
        <Stack.Screen
          name="notifications"
          options={{
            headerShown: false,
          }}
        />
      </StackLayout>
    )
  }

  if (segment === '(settings)') {
    return (
      <StackLayout>
        <Stack.Screen
          name="settings"
          options={{
            title: t('settings.settings.title'),
          }}
        />
      </StackLayout>
    )
  }

  return (
    <StackLayout>
      <Stack.Screen name="index" />
    </StackLayout>
  )
}

function StackLayout({ children }: PropsWithChildren) {
  const t = useTranslations('screen')

  return (
    <Stack
      screenOptions={{
        fullScreenGestureEnabled: true,
        header: (props) => <StackHeader {...props} />,
      }}
    >
      {children}

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
        name="users/[name]/[type]"
        options={(props) => ({
          title: t(`profile.${(props.route.params as UserPostsParams).type}`),
        })}
      />

      <Stack.Screen
        name="users/[name]/comments"
        options={{
          title: t('profile.comments'),
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
