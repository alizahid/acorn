import { FlashList } from '@shopify/flash-list'
import { useRef } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type ListProps } from '~/hooks/list'
import { useScrollToTop } from '~/hooks/scroll-top'
import { usePreferences } from '~/stores/preferences'
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
  listProps?: ListProps<InboxMessage>
  messages: Array<InboxMessage>
  refetch: () => Promise<unknown>
}

export function MessagesList({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  listProps,
  messages,
  refetch,
}: Props) {
  const { themeOled } = usePreferences()

  const list = useRef<FlashList<InboxMessage>>(null)

  useScrollToTop(list, listProps)

  const { styles } = useStyles(stylesheet)

  return (
    <FlashList
      {...listProps}
      ItemSeparatorComponent={() => (
        <View style={styles.separator(themeOled)} />
      )}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="6" /> : null
      }
      data={messages}
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

const stylesheet = createStyleSheet((theme) => ({
  separator: (oled: boolean) => ({
    backgroundColor: oled ? theme.colors.gray.border : undefined,
    height: oled ? 1 : theme.space[4],
  }),
}))
