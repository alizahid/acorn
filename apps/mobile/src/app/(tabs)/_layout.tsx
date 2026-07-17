import { focusManager } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { AppState } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

import icon_notifications from '~/assets/icons/navigation/bell.svg'
import icon_settings from '~/assets/icons/navigation/gear-six.svg'
import icon_home from '~/assets/icons/navigation/house.svg'
import icon_search from '~/assets/icons/navigation/magnifying-glass.svg'
import icon_profile from '~/assets/icons/navigation/user-circle.svg'
import { Tabs } from '~/components/navigation/tabs'
import { useSubscribed } from '~/hooks/purchases/subscribed'
import { useUnread } from '~/hooks/queries/user/unread'
import { mitter } from '~/lib/mitt'
import { Sentry } from '~/lib/sentry'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'

export default function Layout() {
  const router = useRouter()

  const { unread } = useUnread()
  const { subscribed } = useSubscribed()

  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const { minimizeTabBar } = usePreferences(
    useShallow((state) => ({
      minimizeTabBar: state.minimizeTabBar,
    })),
  )

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
    if (subscribed === false) {
      router.navigate('/subscribe')
    }
  }, [subscribed, router])

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
      labeled={false}
      minimizeBehavior={minimizeTabBar ? 'onScrollDown' : 'never'}
      translucent
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: () => icon_home,
        }}
      />

      <Tabs.Screen
        name="(search)"
        options={{
          tabBarIcon: () => icon_search,
        }}
      />

      <Tabs.Screen
        listeners={{
          tabLongPress() {
            mitter.emit('switch-account')
          },
        }}
        name="(profile)"
        options={{
          tabBarIcon: () => icon_profile,
        }}
      />

      <Tabs.Screen
        name="(notifications)"
        options={{
          tabBarBadge: unread,
          tabBarIcon: () => icon_notifications,
        }}
      />

      <Tabs.Screen
        name="(settings)"
        options={{
          tabBarIcon: () => icon_settings,
        }}
      />
    </Tabs>
  )
}
