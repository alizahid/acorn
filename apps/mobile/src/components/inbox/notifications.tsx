import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRef } from 'react'

import { listProps } from '~/lib/common'
import { type InboxNotification } from '~/types/inbox'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { RefreshControl } from '../common/refresh-control'
import { Spinner } from '../common/spinner'
import { View } from '../common/view'
import { NotificationCard } from './notification'

type Props = {
  fetchNextPage: () => Promise<unknown>
  hasNextPage: boolean
  isFetchingNextPage: boolean
  isLoading: boolean
  notifications: Array<InboxNotification>
  refetch: () => Promise<unknown>
}

export function NotificationsList({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  notifications,
  refetch,
}: Props) {
  const list = useRef<FlashList<InboxNotification>>(null)

  useScrollToTop(list)

  return (
    <FlashList
      {...listProps}
      ItemSeparatorComponent={() => <View height="4" />}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="6" /> : null
      }
      data={notifications}
      estimatedItemSize={84}
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
