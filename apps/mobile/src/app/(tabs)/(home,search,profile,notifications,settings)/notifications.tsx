import { Stack } from 'expo-router'
import { useHeaderHeight } from 'expo-router/react-navigation'
import { useState } from 'react'
import { View } from 'react-native'
import { TabView } from 'react-native-tab-view'
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
  const headerHeight = useHeaderHeight()

  const t = useTranslations('screen.notifications')
  const a11y = useTranslations('a11y')

  const { isPending, markAll } = useMarkAllAsRead()

  const [index, setIndex] = useState(0)

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.View>
          <IconButton
            disabled={isPending}
            header
            label={a11y('clearNotifications')}
            onPress={() => {
              markAll()
            }}
          >
            {isPending ? <Spinner /> : <Icon name="checks-bold" />}
          </IconButton>
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      <TabView
        lazy
        navigationState={{
          index,
          routes,
        }}
        onIndexChange={setIndex}
        renderLazyPlaceholder={() => <Loading />}
        renderScene={({ route }) => {
          if (route.key === 'notifications') {
            return <NotificationsList />
          }

          return <MessagesList />
        }}
        renderTabBar={({ jumpTo, navigationState }) => (
          <View style={styles.tabBar(headerHeight)}>
            <SegmentedControl
              items={routes.map(({ key }) => ({
                key,
                label: t(`tabs.${key}`),
              }))}
              onChange={(next) => {
                jumpTo(next)
              }}
              value={navigationState.routes[navigationState.index]?.key}
            />
          </View>
        )}
      />
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  tabBar: (headerHeight: number) => ({
    margin: theme.space[4],
    marginTop: headerHeight + theme.space[4],
  }),
}))
