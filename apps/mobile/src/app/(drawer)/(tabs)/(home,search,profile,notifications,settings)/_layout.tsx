import { Stack, useRouter } from 'expo-router'
import { type PropsWithChildren } from 'react'
import { useTranslations } from 'use-intl'

import { IconButton } from '~/components/common/icon/button'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { StackHeader } from '~/components/navigation/stack-header'
import { useHistory } from '~/hooks/history'
import { mitter } from '~/lib/mitt'
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
  const a11y = useTranslations('a11y')

  const { accountId } = useAuth()
  const { feedType } = useDefaults()

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
                label={a11y('switchAccount')}
                onPress={() => {
                  mitter.emit('switch-account')
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
            title: t('notifications.title'),
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
    <StackLayout>
      <Stack.Screen
        initialParams={{
          type: feedType,
        }}
        name="index"
      />
    </StackLayout>
  )
}

function StackLayout({ children }: PropsWithChildren) {
  const router = useRouter()

  const t = useTranslations('screen')
  const a11y = useTranslations('a11y')

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
        options={({ route }) => ({
          headerRight: () => (
            <IconButton
              icon={{
                name: 'Info',
                weight: 'duotone',
              }}
              label={a11y('aboutCommunity', {
                community: (route.params as CommunityParams).name,
              })}
              onPress={() => {
                router.push({
                  params: {
                    name: (route.params as CommunityParams).name,
                  },
                  pathname: '/communities/[name]/about',
                })
              }}
            />
          ),
          title: (route.params as CommunityParams).name,
        })}
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
                  label={user}
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
          gestureEnabled: (route.params as SignInParams).mode === 'dismissible',
          headerShown: false,
          presentation: 'modal',
        })}
      />
    </Stack>
  )
}
