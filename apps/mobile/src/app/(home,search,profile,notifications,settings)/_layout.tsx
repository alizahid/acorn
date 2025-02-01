import { Stack, useRouter } from 'expo-router'
import { type PropsWithChildren } from 'react'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon-button'
import { Text } from '~/components/common/text'
import { HomeDrawer } from '~/components/home/drawer'
import { StackHeader } from '~/components/navigation/stack-header'
import { UserSwitcher } from '~/components/users/switcher'
import { iPad, modalStyle } from '~/lib/common'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { useAuth } from '~/stores/auth'

import { type HomeParams } from '.'
import { type CommunityParams } from './communities/[name]'
import { type SignInParams } from './sign-in'
import { type UserParams } from './users/[name]'
import { type UserPostsParams } from './users/[name]/[type]'

// eslint-disable-next-line camelcase -- go away
export const unstable_settings = {
  initialRouteName: iPad ? 'index' : 'drawer',
  notifications: {
    initialRouteName: 'notifications',
  },
  profile: {
    initialRouteName: 'profile',
  },
  search: {
    initialRouteName: 'search',
  },
  settings: {
    initialRouteName: 'settings',
  },
}

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
  const tType = useTranslations('component.common.type.type')

  const { accountId } = useAuth()

  const { theme } = useStyles()

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
    <HomeDrawer>
      <StackLayout>
        <Stack.Screen
          name="drawer"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          initialParams={{
            type: 'home',
          }}
          name="index"
          options={({ route }) => {
            const { feed, type } = route.params as HomeParams

            return {
              headerTitle: () => {
                if (feed) {
                  return <Text weight="bold">{feed}</Text>
                }

                return (
                  <>
                    <Icon
                      color={theme.colors[FeedTypeColors[type]].accent}
                      name={FeedTypeIcons[type]}
                      weight="duotone"
                    />

                    <Text weight="bold">{tType(type)}</Text>
                  </>
                )
              },
            }
          }}
        />
      </StackLayout>
    </HomeDrawer>
  )
}

function StackLayout({ children }: PropsWithChildren) {
  const router = useRouter()

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
        options={({ route }) => {
          const { name } = route.params as CommunityParams

          return {
            headerRight: () => (
              <IconButton
                icon={{
                  name: 'Info',
                  weight: 'duotone',
                }}
                onPress={() => {
                  router.navigate({
                    params: {
                      name,
                    },
                    pathname: '/communities/[name]/about',
                  })
                }}
              />
            ),
            title: name,
          }
        }}
      />

      <Stack.Screen
        name="communities/[name]/about"
        options={({ route }) => ({
          title: (route.params as CommunityParams).name,
        })}
      />

      <Stack.Screen
        name="communities/[name]/new"
        options={{
          title: t('posts.new.title'),
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
        options={({ route }) => ({
          headerShown: false,
          title: (route.params as CommunityParams).name,
        })}
      />

      <Stack.Screen
        name="users/[name]/about"
        options={({ route }) => ({
          title: (route.params as UserParams).name,
        })}
      />

      <Stack.Screen
        name="users/[name]/[type]"
        options={({ route }) => ({
          title: t(`profile.${(route.params as UserPostsParams).type}`),
        })}
      />

      <Stack.Screen
        name="posts/[id]/reply"
        options={{
          contentStyle: modalStyle,
          presentation: 'modal',
          title: t('posts.reply.title'),
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
        name="settings/appearance"
        options={{
          title: t('settings.appearance.title'),
        }}
      />

      <Stack.Screen
        name="settings/defaults"
        options={{
          title: t('settings.defaults.defaults.title'),
        }}
      />

      <Stack.Screen
        name="sign-in"
        options={({ route }) => ({
          contentStyle: modalStyle,
          gestureEnabled: (route.params as SignInParams).mode === 'dismissible',
          headerShown: false,
          presentation: 'modal',
        })}
      />
    </Stack>
  )
}
