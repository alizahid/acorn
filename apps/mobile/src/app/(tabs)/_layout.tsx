import { Tabs } from 'expo-router'
import GearSixIcon from 'react-native-phosphor/src/duotone/GearSix'
import HouseIcon from 'react-native-phosphor/src/duotone/House'
import UsersIcon from 'react-native-phosphor/src/duotone/Users'
import UsersFourIcon from 'react-native-phosphor/src/duotone/UsersFour'
import { useTranslations } from 'use-intl'

import { Header } from '~/components/navigation/header'
import { TabBar } from '~/components/navigation/tab-bar'

export default function Layout() {
  const t = useTranslations('screen')

  return (
    <Tabs
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: (props) => <HouseIcon {...props} weight="duotone" />,
          title: t('home.title'),
        }}
      />

      <Tabs.Screen
        name="communities"
        options={{
          tabBarIcon: (props) => <UsersFourIcon {...props} weight="duotone" />,
          title: t('communities.title'),
        }}
      />

      <Tabs.Screen
        name="users"
        options={{
          tabBarIcon: (props) => <UsersIcon {...props} weight="duotone" />,
          title: t('users.title'),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: (props) => <GearSixIcon {...props} weight="duotone" />,
          title: t('settings.title'),
        }}
      />
    </Tabs>
  )
}
