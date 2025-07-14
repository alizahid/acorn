import { focusManager } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { AppState } from 'react-native'
import { useTranslations } from 'use-intl'

import { TabBar } from '~/components/navigation/tab-bar'
import { Tabs } from '~/components/navigation/tabs'
import { switcher } from '~/components/users/switcher'
import { useUnread } from '~/hooks/queries/user/unread'
import { Sentry } from '~/lib/sentry'
import { useAuth } from '~/stores/auth'

export default function Layout() {
  const router = useRouter()

  const t = useTranslations('screen')

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
      <Tabs.Screen
        name="(home)"
        options={{
          title: t('home.title'),
        }}
      />

      <Tabs.Screen
        name="(search)"
        options={{
          title: t('search.title'),
        }}
      />

      <Tabs.Screen
        listeners={{
          tabLongPress() {
            switcher.emit('open')
          },
        }}
        name="(profile)"
        options={{
          title: t('profile.title'),
        }}
      />

      <Tabs.Screen
        name="(notifications)"
        options={{
          tabBarBadge: unread,
          title: t('notifications.title'),
        }}
      />

      <Tabs.Screen
        name="(settings)"
        options={{
          title: t('settings.title'),
        }}
      />

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
