import { Stack, useRouter } from 'expo-router'
import { type PropsWithChildren } from 'react'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon-button'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { drawer, HomeDrawer } from '~/components/home/drawer'
import { StackHeader } from '~/components/navigation/stack-header'
import { switcher } from '~/components/users/switcher'
import { useHistory } from '~/hooks/history'
import { modalStyle } from '~/lib/common'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { useAuth } from '~/stores/auth'
import { useDefaults } from '~/stores/defaults'
import { type Undefined } from '~/types'

import { type HomeParams } from '.'
import { type CommunityParams } from './communities/[name]'
import { type MessageParams } from './messages/[id]'
import { type PostParams } from './posts/[id]'
import { type SignInParams } from './sign-in'
import { type UserParams } from './users/[name]'
import { type UserPostsParams } from './users/[name]/[type]'

// eslint-disable-next-line camelcase -- go away
export const unstable_settings = {
  initialRouteName: 'index',
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
  const { feedType } = useDefaults()

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

        <Stack.Screen
          name="index"
          options={({ route }) => ({
            title: (route.params as Undefined<HomeParams>)?.feed,
          })}
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
            headerRight: () => (
              <IconButton
                icon={{
                  name: 'UserSwitch',
                }}
                onPress={() => {
                  switcher.emit('open')
                }}
              />
            ),
            title: accountId,
          }}
        />

        <Stack.Screen
          name="index"
          options={({ route }) => ({
            title: (route.params as Undefined<HomeParams>)?.feed,
          })}
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

        <Stack.Screen
          name="index"
          options={({ route }) => ({
            title: (route.params as Undefined<HomeParams>)?.feed,
          })}
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
          initialParams={{
            type: feedType,
          }}
          name="index"
          options={({ route }) => {
            const { feed, type } = route.params as HomeParams

            return {
              headerLeft: () => (
                <IconButton
                  icon={{
                    name: 'Sidebar',
                    weight: 'duotone',
                  }}
                  onPress={() => {
                    drawer.emit('toggle')
                  }}
                />
              ),
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

  const { addPost } = useHistory()

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
                  router.push({
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
        name="posts/new"
        options={{
          title: t('posts.new.title'),
        }}
      />

      <Stack.Screen
        listeners={({ route }) => ({
          focus() {
            addPost({
              id: (route.params as PostParams).id,
            })
          },
        })}
        name="posts/[id]/index"
        options={{
          headerTransparent: false,
        }}
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
        name="messages/[id]"
        options={({ route }) => ({
          headerTitle: () => {
            const { user } = route.params as MessageParams

            if (user) {
              return (
                <Pressable
                  height="8"
                  justify="center"
                  onPress={() => {
                    router.push({
                      params: {
                        name: user,
                      },
                      pathname: '/users/[name]',
                    })
                  }}
                  px="3"
                >
                  <Text weight="bold">{user}</Text>
                </Pressable>
              )
            }
          },
        })}
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
        name="settings/filters"
        options={{
          title: t('settings.filters.title'),
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
