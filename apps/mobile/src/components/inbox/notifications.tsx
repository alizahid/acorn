import { FlashList } from '@shopify/flash-list'
import { useRef } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type ListProps } from '~/hooks/list'
import { useScrollToTop } from '~/hooks/scroll-top'
import { usePreferences } from '~/stores/preferences'
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
  listProps?: ListProps<InboxNotification>
  notifications: Array<InboxNotification>
  refetch: () => Promise<unknown>
}

export function NotificationsList({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  listProps,
  notifications,
  refetch,
}: Props) {
  const { themeOled } = usePreferences()

  const list = useRef<FlashList<InboxNotification>>(null)

  useScrollToTop(list, listProps)

  const { styles } = useStyles(stylesheet)

  return (
    <FlashList
      {...listProps}
      data={notifications}
      ItemSeparatorComponent={() => (
        <View style={styles.separator(themeOled)} />
      )}
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
      renderItem={({ item }) => <NotificationCard notification={item} />}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  separator: (oled: boolean) => ({
    backgroundColor: oled ? theme.colors.gray.border : undefined,
    height: oled ? 1 : theme.space[4],
  }),
}))
