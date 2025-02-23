import { LegendList, type LegendListRef } from '@legendapp/list'
import { useScrollToTop } from '@react-navigation/native'
import { useRef } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { estimateHeight, type ListProps } from '~/hooks/list'
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
  listProps?: ListProps
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

  const list = useRef<LegendListRef>(null)

  useScrollToTop(list)

  const { styles } = useStyles(stylesheet)

  return (
    <LegendList
      {...listProps}
      ItemSeparatorComponent={() => (
        <View style={styles.separator(themeOled)} />
      )}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="6" /> : null
      }
      data={notifications}
      estimatedItemSize={200}
      getEstimatedItemSize={(index, item) =>
        estimateHeight({
          index,
          item,
          type: 'notification',
        })
      }
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
        }
      }}
      recycleItems
      ref={list}
      refreshControl={
        <RefreshControl
          offset={listProps?.progressViewOffset}
          onRefresh={refetch}
        />
      }
      renderItem={({ item }) => <NotificationCard notification={item} />}
    />
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  separator: (oled: boolean) => ({
    backgroundColor: oled ? theme.colors.gray.border : undefined,
    height: oled ? runtime.hairlineWidth : theme.space[4],
  }),
}))
