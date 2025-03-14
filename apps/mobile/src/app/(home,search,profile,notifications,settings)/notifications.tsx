import { useState } from 'react'
import { TabView } from 'react-native-tab-view'
import { useTranslations } from 'use-intl'

import { IconButton } from '~/components/common/icon-button'
import { Loading } from '~/components/common/loading'
import { SegmentedControl } from '~/components/common/segmented-control'
import { View } from '~/components/common/view'
import { MessagesList } from '~/components/inbox/messages'
import { NotificationsList } from '~/components/inbox/notifications'
import { Header } from '~/components/navigation/header'
import { ListFlags, useList } from '~/hooks/list'
import { useMarkAllAsRead } from '~/hooks/mutations/users/notifications'
import { useInbox } from '~/hooks/queries/user/inbox'
import { heights } from '~/lib/common'
import { InboxTab } from '~/types/inbox'

const routes = InboxTab.map((key) => ({
  key,
  title: key,
}))

export default function Screen() {
  const t = useTranslations('screen.notifications')

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    messages,
    notifications,
    refetch,
  } = useInbox()

  const { isPending, markAll } = useMarkAllAsRead()

  const listProps = useList(ListFlags.ALL, {
    top: heights.notifications,
  })

  const [index, setIndex] = useState(0)

  const props = {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    listProps,
    refetch,
  } as const

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
          return <NotificationsList {...props} notifications={notifications} />
        }

        return <MessagesList {...props} messages={messages} />
      }}
      renderTabBar={({ position }) => (
        <Header
          right={
            <IconButton
              icon={{
                name: 'CheckCircle',
              }}
              loading={isPending}
              onPress={() => {
                markAll()
              }}
            />
          }
          title={t('title')}
        >
          <View pb="4" px="3">
            <SegmentedControl
              items={routes.map(({ key }) => t(`tabs.${key}`))}
              offset={position}
              onChange={(next) => {
                setIndex(next)
              }}
            />
          </View>
        </Header>
      )}
    />
  )
}
