import {
  Tabs,
  useFocusEffect,
  useGlobalSearchParams,
  useRouter,
} from 'expo-router'
import { useEffect } from 'react'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Header } from '~/components/navigation/header'
import { PagerHeader } from '~/components/navigation/pager'
import { TabBar } from '~/components/navigation/tab-bar'
import { AccountSwitchCard } from '~/components/users/switch'
import { useAuth } from '~/stores/auth'

export default function Layout() {
  const router = useRouter()
  const params = useGlobalSearchParams()

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
        initialParams={{
          page: 0,
        }}
        name="communities"
        options={{
          header: () => (
            <PagerHeader
              active={Number(params.page) || 0}
              items={[t('communities.communities'), t('communities.users')]}
            />
          ),
          tabBarIcon: (props) => (
            <Icon {...props} name="UsersFour" weight="duotone" />
          ),
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
