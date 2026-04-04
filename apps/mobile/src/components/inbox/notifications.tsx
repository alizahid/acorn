import { useScrollToTop } from '@react-navigation/native'
import { FlashList, type FlashListRef } from '@shopify/flash-list'
import { useRef } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { useNotifications } from '~/hooks/queries/user/notifications'
import { usePreferences } from '~/stores/preferences'
import { type Notification } from '~/types/notification'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { RefreshControl } from '../common/refresh-control'
import { Spinner } from '../common/spinner'
import { NotificationCard } from './notification'

export function NotificationsList() {
  const { themeOled } = usePreferences()

  styles.useVariants({
    oled: themeOled,
  })

  const list = useRef<FlashListRef<Notification>>(null)

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    notifications,
    refetch,
  } = useNotifications()

  useScrollToTop(list)

  return (
    <FlashList
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
      ref={list}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ item }) => <NotificationCard notification={item} />}
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
