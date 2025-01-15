import { focusManager } from '@tanstack/react-query'
import { Tabs, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { AppState } from 'react-native'

import { Icon } from '~/components/common/icon'
import { TabBar } from '~/components/navigation/tab-bar'
import { useUnread } from '~/hooks/queries/user/unread'
import { Sentry } from '~/lib/sentry'
import { useAuth } from '~/stores/auth'

export function RootLayout() {
  const router = useRouter()

  const { accountId } = useAuth()
  const { unread } = useUnread()

  useEffect(() => {
    if (accountId) {
      Sentry.setUser({
        id: accountId,
      })

      return
    }

    Sentry.setUser(null)

    router.navigate('/sign-in')
  }, [accountId, router])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active')
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return (
    <Tabs
      screenOptions={{
        animation: 'fade',
        headerShown: false,
        lazy: true,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon color={color} name="House" size={size} weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="(search)"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon
              color={color}
              name="MagnifyingGlass"
              size={size}
              weight="duotone"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(profile)"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon
              color={color}
              name="UserCircle"
              size={size}
              weight="duotone"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(notifications)"
        options={{
          tabBarBadge: unread,
          tabBarIcon: ({ color, size }) => (
            <Icon color={color} name="Bell" size={size} weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="(settings)"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon color={color} name="GearSix" size={size} weight="duotone" />
          ),
        }}
      />
    </Tabs>
  )
}
