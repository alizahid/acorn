import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRef } from 'react'

import { listProps } from '~/lib/common'
import { type InboxMessage } from '~/types/inbox'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { RefreshControl } from '../common/refresh-control'
import { Spinner } from '../common/spinner'
import { View } from '../common/view'
import { MessageCard } from './message'

type Props = {
  fetchNextPage: () => Promise<unknown>
  hasNextPage: boolean
  isFetchingNextPage: boolean
  isLoading: boolean
  messages: Array<InboxMessage>
  refetch: () => Promise<unknown>
}

export function MessagesList({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  messages,
  refetch,
}: Props) {
  const list = useRef<FlashList<InboxMessage>>(null)

  useScrollToTop(list)

  return (
    <FlashList
      {...listProps}
      ItemSeparatorComponent={() => <View height="4" />}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="6" /> : null
      }
      data={messages}
      estimatedItemSize={200}
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
        }
      }}
      ref={list}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ item }) => <MessageCard message={item} />}
    />
  )
}
