import { focusManager } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { AppState } from 'react-native'

import { TabBar } from '~/components/navigation/tab-bar'
import { useUnread } from '~/hooks/queries/user/unread'
import { Sentry } from '~/lib/sentry'
import { useAuth } from '~/stores/auth'

import { Tabs } from './tabs'

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
        lazy: true,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="(home)" />

      <Tabs.Screen name="(search)" />

      <Tabs.Screen name="(profile)" />

      <Tabs.Screen
        name="(notifications)"
        options={{
          tabBarBadge: unread,
        }}
      />

      <Tabs.Screen name="(settings)" />

      <Tabs.Screen
        name="+not-found"
        options={{
          tabBarItemHidden: true,
        }}
      />

      <Tabs.Screen
        name="_sitemap"
        options={{
          tabBarItemHidden: true,
        }}
      />
    </Tabs>
  )
}
