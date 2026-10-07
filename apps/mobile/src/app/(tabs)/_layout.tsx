import { focusManager } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { NativeTabs } from 'expo-router/native-tabs'
import { useEffect } from 'react'
import { AppState } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { useUnread } from '~/hooks/queries/user/unread'
import { glass } from '~/lib/common'
import { Sentry } from '~/lib/sentry'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'

export default function Layout() {
  const router = useRouter()

  const t = useTranslations('screen')

  const { theme } = useUnistyles()

  const { unread } = useUnread()

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
    const subscription = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active')
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return (
    <NativeTabs
      badgeBackgroundColor={theme.colors.accent.accent}
      badgeTextColor={theme.colors.accent.contrast}
      blurEffect={glass ? 'none' : 'systemChromeMaterial'}
      disableTransparentOnScrollEdge
      iconColor={{
        default: theme.colors.accent.contrast,
        selected: theme.colors.accent.accent,
      }}
      minimizeBehavior={minimizeTabBar ? 'onScrollDown' : 'never'}
      shadowColor="transparent"
    >
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

        {unread ? (
          <NativeTabs.Trigger.Badge>{unread}</NativeTabs.Trigger.Badge>
        ) : null}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(notifications)">
        <NativeTabs.Trigger.Icon sf="bell" />

        <NativeTabs.Trigger.Label hidden>
          {t('notifications.title')}
        </NativeTabs.Trigger.Label>
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
