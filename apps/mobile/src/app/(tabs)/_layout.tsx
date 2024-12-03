import { Tabs } from 'expo-router'
import { useStyles } from 'react-native-unistyles'

import { Icon } from '~/components/common/icon'
import { TabBar } from '~/components/navigation/tab-bar'
import { useUnread } from '~/hooks/queries/user/unread'

export default function Layout() {
  const { theme } = useStyles()

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
          tabBarIcon: ({ focused }) => (
            <Icon
              color={theme.colors[focused ? 'accent' : 'gray'].a9}
              name="House"
              size={theme.space[5]}
              weight="duotone"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(search)"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              color={theme.colors[focused ? 'accent' : 'gray'].a9}
              name="MagnifyingGlass"
              size={theme.space[5]}
              weight="duotone"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(profile)"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              color={theme.colors[focused ? 'accent' : 'gray'].a9}
              name="UserCircle"
              size={theme.space[5]}
              weight="duotone"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(notifications)"
        options={{
          tabBarBadge: unread,
          tabBarIcon: ({ focused }) => (
            <Icon
              color={theme.colors[focused ? 'accent' : 'gray'].a9}
              name="Bell"
              size={theme.space[5]}
              weight="duotone"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(settings)"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              color={theme.colors[focused ? 'accent' : 'gray'].a9}
              name="GearSix"
              size={theme.space[5]}
              weight="duotone"
            />
          ),
        }}
      />
    </Tabs>
  )
}
