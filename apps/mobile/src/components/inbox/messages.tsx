import { FlashList } from '@shopify/flash-list'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { useMessages } from '~/hooks/queries/user/messages'
import { heights } from '~/lib/common'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { RefreshControl } from '../common/refresh-control'
import { Spinner } from '../common/spinner'
import { MessageCard } from './message'

export function MessagesList() {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    messages,
    refetch,
  } = useMessages()

  return (
    <FlashList
      contentContainerStyle={styles.content}
      data={messages}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner style={styles.spinner} /> : null
      }
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage()
        }
      }}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ item }) => <MessageCard message={item} />}
    />
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  content: {
    flexGrow: 1,
    paddingBottom: heights.tabBar + runtime.insets.bottom,
  },
  separator: {
    backgroundColor: theme.colors.gray.border,
    height: 1,
  },
  spinner: {
    margin: theme.space[6],
  },
}))
