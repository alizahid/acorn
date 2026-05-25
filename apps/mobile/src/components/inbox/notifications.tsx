import { FlashList } from '@shopify/flash-list'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { useNotifications } from '~/hooks/queries/user/notifications'
import { listProps } from '~/lib/list'
import { usePreferences } from '~/stores/preferences'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { RefreshControl } from '../common/refresh-control'
import { Spinner } from '../common/spinner'
import { NotificationCard } from './notification'

export function NotificationsList() {
  const { themeOled } = usePreferences(['themeOled'])

  styles.useVariants({
    oled: themeOled,
  })

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
      contentContainerStyle={styles.content}
      data={notifications}
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
      renderItem={({ item }) => <NotificationCard notification={item} />}
    />
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  content: {
    paddingBottom: theme.space[9] + runtime.insets.bottom,
  },
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
