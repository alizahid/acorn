import { Tabs, useFocusEffect, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Header } from '~/components/navigation/header'
import { TabBar } from '~/components/navigation/tab-bar'
import { useAuth } from '~/stores/auth'

export default function Layout() {
  const router = useRouter()

  const t = useTranslations('screen')

  const { accessToken, expired, refresh } = useAuth()

  useEffect(() => {
    if (expired) {
      void refresh()
    }
  }, [expired, refresh])

  useFocusEffect(() => {
    if (!accessToken) {
      router.navigate('/auth/sign-in')
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
            <Icon
              {...props}
              name="House"
              weight={props.focused ? 'fill' : 'duotone'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: (props) => (
            <Icon
              {...props}
              name="MagnifyingGlass"
              weight={props.focused ? 'fill' : 'duotone'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="user"
        options={{
          headerShown: false,
          tabBarIcon: (props) => (
            <Icon
              {...props}
              name="UserCircle"
              weight={props.focused ? 'fill' : 'duotone'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="communities"
        options={{
          tabBarIcon: (props) => (
            <Icon
              {...props}
              name="UsersFour"
              weight={props.focused ? 'fill' : 'duotone'}
            />
          ),
          title: t('communities.title'),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: (props) => (
            <Icon
              {...props}
              name="GearSix"
              weight={props.focused ? 'fill' : 'duotone'}
            />
          ),
          title: t('settings.title'),
        }}
      />
    </Tabs>
  )
}
