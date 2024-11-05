import { Stack, useRouter } from 'expo-router'
import { useTranslations } from 'use-intl'

import { Header } from '~/components/navigation/header'
import { HeaderButton } from '~/components/navigation/header-button'
import { AccountSwitchCard } from '~/components/users/switch'
import { type CommunityParams } from '~/screens/communities/community'
import { type CommunitiesSearchParams } from '~/screens/communities/search'
import { type UserPostsParams } from '~/screens/users/posts'
import { type UserParams } from '~/screens/users/user'
import { useAuth } from '~/stores/auth'

export function ProfileLayout() {
  const router = useRouter()

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
        options={(props) => {
          const { name } = props.route.params as CommunityParams

          return {
            headerRight: () => (
              <HeaderButton
                color="gray"
                icon="MagnifyingGlass"
                onPress={() => {
                  router.navigate({
                    params: {
                      name,
                    },
                    pathname: '/communities/[name]/search',
                  })
                }}
              />
            ),
            title: name,
          }
        }}
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
        name="settings/about"
        options={{
          title: t('settings.about.title'),
        }}
      />

      <Stack.Screen
        name="settings/cache"
        options={{
          title: t('settings.cache.title'),
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
    </Stack>
  )
}
