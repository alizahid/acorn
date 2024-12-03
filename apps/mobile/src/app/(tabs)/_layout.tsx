import { Tabs } from 'expo-router'

import { Icon } from '~/components/common/icon'
import { TabBar } from '~/components/navigation/tab-bar'
import { useUnread } from '~/hooks/queries/user/unread'

export default function Layout() {
  const { unread } = useUnread()

  return (
    <Tabs
      screenOptions={{
        animation: 'fade',
        headerShown: false,
        lazy: true,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon color={color} name="House" size={size} weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="(search)"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon
              color={color}
              name="MagnifyingGlass"
              size={size}
              weight="duotone"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(profile)"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon
              color={color}
              name="UserCircle"
              size={size}
              weight="duotone"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(notifications)"
        options={{
          tabBarBadge: unread,
          tabBarIcon: ({ color, size }) => (
            <Icon color={color} name="Bell" size={size} weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="(settings)"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon color={color} name="GearSix" size={size} weight="duotone" />
          ),
        }}
      />
    </Tabs>
  )
}
