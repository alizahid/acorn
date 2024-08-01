import { Tabs, useFocusEffect, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Header } from '~/components/navigation/header'
import { TabBar } from '~/components/navigation/tab-bar'
import { AccountSwitchCard } from '~/components/user/switch'
import { useAuth } from '~/stores/auth'

export default function Layout() {
  const router = useRouter()

  const t = useTranslations('tab')

  const { accessToken, expired, refresh } = useAuth()

  useEffect(() => {
    if (expired) {
      void refresh()
    }
  }, [expired, refresh])

  useFocusEffect(() => {
    if (!accessToken) {
      router.navigate('/sign-in')
    }
  })

  return (
    <Tabs
      screenOptions={{
        header: (props) => <Header {...props} />,
        lazy: true,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: (props) => (
            <Icon {...props} name="House" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: (props) => (
            <Icon {...props} name="MagnifyingGlass" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="communities"
        options={{
          tabBarIcon: (props) => (
            <Icon {...props} name="UsersFour" weight="duotone" />
          ),
          title: t('communities.title'),
        }}
      />

      <Tabs.Screen
        name="user"
        options={{
          headerRight: () => <AccountSwitchCard />,
          tabBarIcon: (props) => (
            <Icon {...props} name="UserCircle" weight="duotone" />
          ),
        }}
      />
    </Tabs>
  )
}
