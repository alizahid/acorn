import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRef } from 'react'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { NotificationCard } from '~/components/notifications/card'
import { useNotifications } from '~/hooks/queries/user/notifications'
import { listProps } from '~/lib/common'
import { type Notification } from '~/types/notification'

export function NotificationsScreen() {
  const list = useRef<FlashList<Notification>>(null)

  useScrollToTop(list)

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    notifications,
    refetch,
  } = useNotifications()

  return (
    <FlashList
      {...listProps}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="6" /> : null
      }
      data={notifications}
      estimatedItemSize={68}
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
        }
      }}
      ref={list}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ item }) => <NotificationCard notification={item} />}
    />
  )
}
