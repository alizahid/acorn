import { useRef, useState } from 'react'
import { TabView } from 'react-native-tab-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Loading } from '~/components/common/loading'
import { SegmentedControl } from '~/components/common/segmented-control'
import { View } from '~/components/common/view'
import { MessagesList } from '~/components/inbox/messages'
import { NotificationsList } from '~/components/inbox/notifications'
import { useInbox } from '~/hooks/queries/user/inbox'
import { InboxTab } from '~/types/inbox'

export function NotificationsScreen() {
  const t = useTranslations('screen.notifications.tabs')

  const { styles } = useStyles(stylesheet)

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    messages,
    notifications,
    refetch,
  } = useInbox()

  const routes = useRef(
    InboxTab.map((key) => ({
      key,
      title: t(key),
    })),
  )

  const [index, setIndex] = useState(0)

  const props = {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } as const

  return (
    <TabView
      lazy
      navigationState={{
        index,
        routes: routes.current,
      }}
      onIndexChange={setIndex}
      renderLazyPlaceholder={Loading}
      renderScene={({ route }) => {
        if (route.key === 'notifications') {
          return <NotificationsList {...props} notifications={notifications} />
        }

        return <MessagesList {...props} messages={messages} />
      }}
      renderTabBar={({ position }) => (
        <View pb="4" px="3" style={styles.tabs}>
          <SegmentedControl
            items={routes.current.map(({ title }) => title)}
            offset={position}
            onChange={(next) => {
              setIndex(next)
            }}
          />
        </View>
      )}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  tabs: {
    backgroundColor: theme.colors.gray[1],
  },
}))
