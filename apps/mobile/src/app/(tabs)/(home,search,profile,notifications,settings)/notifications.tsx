import { Stack } from 'expo-router'
import { useCallback, useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-screens/experimental'
import {
  type NavigationState,
  type SceneRendererProps,
  TabView,
} from 'react-native-tab-view'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
import { Loading } from '~/components/common/loading'
import { SegmentedControl } from '~/components/common/segmented-control'
import { Spinner } from '~/components/common/spinner'
import { MessagesList } from '~/components/inbox/messages'
import { NotificationsList } from '~/components/inbox/notifications'
import { useMarkAllAsRead } from '~/hooks/mutations/users/notifications'
import { InboxTab } from '~/types/inbox'

const routes = InboxTab.map((key) => ({
  key,
  title: key,
}))

export default function Screen() {
  const t = useTranslations('screen.notifications')
  const a11y = useTranslations('a11y')

  const { isPending, markAll } = useMarkAllAsRead()

  const [index, setIndex] = useState(0)

  const renderScene = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: {
        key: 'notifications' | 'messages'
        title: 'notifications' | 'messages'
      }
    }) => {
      if (route.key === 'notifications') {
        return <NotificationsList />
      }

      return <MessagesList />
    },
    [],
  )

  const renderTabBar = useCallback(
    ({
      jumpTo,
      navigationState,
    }: SceneRendererProps & {
      navigationState: NavigationState<{
        key: 'notifications' | 'messages'
        title: 'notifications' | 'messages'
      }>
    }) => (
      <View style={styles.tabBar}>
        <SegmentedControl
          items={routes.map(({ key }) => ({
            label: t(`tabs.${key}`),
            value: key,
          }))}
          onChange={(next) => {
            jumpTo(next)
          }}
          value={navigationState.routes[navigationState.index]?.key}
        />
      </View>
    ),
    [t],
  )

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.View>
          <IconButton
            accessibilityLabel={a11y('clearNotifications')}
            disabled={isPending}
            header
            onPress={() => {
              markAll()
            }}
          >
            {isPending ? <Spinner /> : <Icon name="checks-bold" />}
          </IconButton>
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      <SafeAreaView
        edges={{
          top: true,
        }}
      >
        <TabView
          lazy
          navigationState={{
            index,
            routes,
          }}
          onIndexChange={setIndex}
          renderLazyPlaceholder={() => <Loading />}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
        />
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  tabBar: {
    padding: theme.space[4],
  },
}))
