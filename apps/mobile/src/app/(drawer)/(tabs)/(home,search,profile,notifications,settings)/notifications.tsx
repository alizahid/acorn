import { useRef, useState } from 'react'
import { TabView } from 'react-native-tab-view'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Loading } from '~/components/common/loading'
import { SegmentedControl } from '~/components/common/segmented-control'
import { View } from '~/components/common/view'
import { MessagesList } from '~/components/inbox/messages'
import { NotificationsList } from '~/components/inbox/notifications'
import { Header } from '~/components/navigation/header'
import { HeaderButton } from '~/components/navigation/header-button'
import { useList } from '~/hooks/list'
import { useMarkAllAsRead } from '~/hooks/mutations/users/notifications'
import { useInbox } from '~/hooks/queries/user/inbox'
import { InboxTab } from '~/types/inbox'

export default function Screen() {
  const t = useTranslations('screen.notifications')

  const { theme } = useStyles()

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

  const listProps = useList({
    top: theme.space[7] + theme.space[4],
  })

  const routes = useRef(
    InboxTab.map((key) => ({
      key,
      title: t(`tabs.${key}`),
    })),
  )

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
        <Header
          right={
            <HeaderButton
              icon="CheckCircle"
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
              items={routes.current.map(({ title }) => title)}
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
