import { focusManager } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { NativeTabs } from 'expo-router/native-tabs'
import { useEffect } from 'react'
import { AppState } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { type NavSymbol } from '~/assets/icons/symbols/nav.symbols'
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
      minimizeBehavior={minimizeTabBar ? 'onScrollDown' : 'never'}
      shadowColor="transparent"
      tintColor={theme.colors.accent.accent}
    >
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Icon xcasset={'nano.house' satisfies NavSymbol} />

        <NativeTabs.Trigger.Label hidden>
          {t('home.title')}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(search)">
        <NativeTabs.Trigger.Icon
          xcasset={'nano.magnifying-glass' satisfies NavSymbol}
        />

        <NativeTabs.Trigger.Label hidden>
          {t('search.title')}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(profile)">
        <NativeTabs.Trigger.Icon
          xcasset={'nano.user-circle' satisfies NavSymbol}
        />

        <NativeTabs.Trigger.Label hidden>
          {t('profile.title')}
        </NativeTabs.Trigger.Label>

        {unread ? (
          <NativeTabs.Trigger.Badge>{unread}</NativeTabs.Trigger.Badge>
        ) : null}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(notifications)">
        <NativeTabs.Trigger.Icon xcasset={'nano.bell' satisfies NavSymbol} />

        <NativeTabs.Trigger.Label hidden>
          {t('notifications.title')}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(settings)">
        <NativeTabs.Trigger.Icon
          xcasset={'nano.gear-six' satisfies NavSymbol}
        />

        <NativeTabs.Trigger.Label hidden>
          {t('settings.title')}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
