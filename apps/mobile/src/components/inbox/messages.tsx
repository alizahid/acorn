import { FlashList, type FlashListRef } from '@shopify/flash-list'
import { useRef } from 'react'
import { StyleSheet } from 'react-native-unistyles'

import { type ListProps } from '~/hooks/list'
import { useMessages } from '~/hooks/queries/user/messages'
import { useScrollToTop } from '~/hooks/scroll-top'
import { usePreferences } from '~/stores/preferences'
import { type Message } from '~/types/message'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { RefreshControl } from '../common/refresh-control'
import { Spinner } from '../common/spinner'
import { View } from '../common/view'
import { MessageCard } from './message'

type Props = {
  listProps?: ListProps<Message>
}

export function MessagesList({ listProps }: Props) {
  const { themeOled } = usePreferences()

  styles.useVariants({
    oled: themeOled,
  })

  const list = useRef<FlashListRef<Message>>(null)

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    messages,
    refetch,
  } = useMessages()

  useScrollToTop(list, listProps)

  return (
    <FlashList
      {...listProps}
      data={messages}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="6" /> : null
      }
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage()
        }
      }}
      ref={list}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ item }) => <MessageCard message={item} />}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  separator: {
    height: theme.space[4],
    variants: {
      oled: {
        true: {
          backgroundColor: theme.colors.gray.border,
          height: 1,
        },
      },
    },
  },
}))
