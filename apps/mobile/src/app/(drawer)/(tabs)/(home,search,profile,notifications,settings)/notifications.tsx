import { useFocusEffect, useNavigation } from 'expo-router'
import { useCallback, useState } from 'react'
import { View } from 'react-native'
import { TabView } from 'react-native-tab-view'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { IconButton } from '~/components/common/icon/button'
import { Loading } from '~/components/common/loading'
import { SegmentedControl } from '~/components/common/segmented-control'
import { MessagesList } from '~/components/inbox/messages'
import { NotificationsList } from '~/components/inbox/notifications'
import { useMarkAllAsRead } from '~/hooks/mutations/users/notifications'
import { InboxTab } from '~/types/inbox'

const routes = InboxTab.map((key) => ({
  key,
  title: key,
}))

export default function Screen() {
  const navigation = useNavigation()

  const t = useTranslations('screen.notifications')
  const a11y = useTranslations('a11y')

  const { isPending, markAll } = useMarkAllAsRead()

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            icon="checkmark"
            label={a11y('clearNotifications')}
            loading={isPending}
            onPress={() => {
              markAll()
            }}
            size="6"
          />
        ),
      })
    }, [a11y, isPending, markAll, navigation]),
  )

  const [index, setIndex] = useState(0)

  return (
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
        <View style={styles.tabBar}>
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
  )
}

const styles = StyleSheet.create((theme) => ({
  tabBar: {
    padding: theme.space[4],
  },
}))
