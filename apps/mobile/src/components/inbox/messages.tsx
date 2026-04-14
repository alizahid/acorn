import { FlashList } from '@shopify/flash-list'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { useMessages } from '~/hooks/queries/user/messages'
import { usePreferences } from '~/stores/preferences'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { RefreshControl } from '../common/refresh-control'
import { Spinner } from '../common/spinner'
import { MessageCard } from './message'

export function MessagesList() {
  const { themeOled } = usePreferences()

  styles.useVariants({
    oled: themeOled,
  })

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
  spinner: {
    margin: theme.space[6],
  },
}))
