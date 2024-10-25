import { Tabs } from 'expo-router'

import { Icon } from '~/components/common/icon'
import { TabBar } from '~/components/navigation/tab-bar'
import { useNotifications } from '~/hooks/queries/user/notifications'

export default function Layout() {
  const { unread } = useNotifications()

  return (
    <Tabs
      screenOptions={{
        animation: 'shift',
        headerShown: false,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: (props) => (
            <Icon {...props} name="House" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="(search)"
        options={{
          tabBarIcon: (props) => (
            <Icon {...props} name="MagnifyingGlass" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="(profile)"
        options={{
          tabBarIcon: (props) => (
            <Icon {...props} name="UserCircle" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="(notifications)"
        options={{
          tabBarBadge: Math.min(unread, 99),
          tabBarIcon: (props) => (
            <Icon {...props} name="Bell" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="(communities)"
        options={{
          tabBarIcon: (props) => (
            <Icon {...props} name="UsersFour" weight="duotone" />
          ),
        }}
      />
    </Tabs>
  )
}
