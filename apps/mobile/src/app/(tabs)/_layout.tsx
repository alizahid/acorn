import { Tabs, useFocusEffect, useRouter } from 'expo-router'
import { useEffect } from 'react'
import GearSixIcon from 'react-native-phosphor/src/duotone/GearSix'
import HouseIcon from 'react-native-phosphor/src/duotone/House'
import MagnifyingGlassIcon from 'react-native-phosphor/src/duotone/MagnifyingGlass'
import UsersFourIcon from 'react-native-phosphor/src/duotone/UsersFour'
import GearSixFillIcon from 'react-native-phosphor/src/fill/GearSix'
import HouseFillIcon from 'react-native-phosphor/src/fill/House'
import MagnifyingGlassFillIcon from 'react-native-phosphor/src/fill/MagnifyingGlass'
import UsersFourFillIcon from 'react-native-phosphor/src/fill/UsersFour'
import { useTranslations } from 'use-intl'

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
          tabBarIcon: (props) => {
            const Icon = props.focused ? HouseFillIcon : HouseIcon

            return <Icon {...props} />
          },
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: (props) => {
            const Icon = props.focused
              ? MagnifyingGlassFillIcon
              : MagnifyingGlassIcon

            return <Icon {...props} />
          },
        }}
      />

      <Tabs.Screen
        name="communities"
        options={{
          tabBarIcon: (props) => {
            const Icon = props.focused ? UsersFourFillIcon : UsersFourIcon

            return <Icon {...props} />
          },
          title: t('communities.title'),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: (props) => {
            const Icon = props.focused ? GearSixFillIcon : GearSixIcon

            return <Icon {...props} />
          },
          title: t('settings.title'),
        }}
      />
    </Tabs>
  )
}
