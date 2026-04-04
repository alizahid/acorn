import { focusManager } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { useEffect } from 'react'
import { AppState } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useSubscribed } from '~/hooks/purchases/subscribed'
import { useUnread } from '~/hooks/queries/user/unread'
import { Sentry } from '~/lib/sentry'
import { useAuth } from '~/stores/auth'

export default function Layout() {
  const router = useRouter()

  const t = useTranslations('screen')

  const { accountId } = useAuth()
  const { unread } = useUnread()
  const { subscribed } = useSubscribed()

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
    <NativeTabs tintColor={styles.main.color}>
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Icon sf="house" />
        <NativeTabs.Trigger.Label hidden>
          {t('home.title')}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(search)">
        <NativeTabs.Trigger.Icon sf="magnifyingglass" />
        <NativeTabs.Trigger.Label hidden>
          {t('search.title')}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(profile)">
        <NativeTabs.Trigger.Icon sf="person.crop.circle" />
        <NativeTabs.Trigger.Label hidden>
          {t('profile.title')}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(notifications)">
        <NativeTabs.Trigger.Icon sf="bell" />
        <NativeTabs.Trigger.Label hidden>
          {t('notifications.title')}
        </NativeTabs.Trigger.Label>
        {unread ? (
          <NativeTabs.Trigger.Badge>{unread}</NativeTabs.Trigger.Badge>
        ) : null}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(settings)">
        <NativeTabs.Trigger.Icon sf="gearshape" />
        <NativeTabs.Trigger.Label hidden>
          {t('settings.title')}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    color: theme.colors.accent.accent,
  },
}))
