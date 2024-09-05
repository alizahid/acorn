import { useIsFocused } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { type UserPostsProps, useUserPosts } from '~/hooks/queries/user/posts'
import { listProps } from '~/lib/common'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { View } from '../common/view'
import { type PostLabel } from '../posts/footer'

type Props = UserPostsProps & {
  inset?: boolean
  label?: PostLabel
  onRefresh?: () => void
}

export function UserPostsList({
  inset,
  interval,
  label,
  onRefresh,
  sort,
  type,
  username,
}: Props) {
  const { styles } = useStyles(stylesheet)

  const focused = useIsFocused()

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    posts,
    refetch,
  } = useUserPosts({
    interval,
    sort,
    type,
    username,
  })

  const [viewing, setViewing] = useState<Array<string>>([])

  return (
    <FlashList
      {...listProps}
      ItemSeparatorComponent={() => (
        <View height={1} style={styles.separator} />
      )}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="4" /> : null
      }
      contentContainerStyle={styles.content(inset)}
      data={posts}
      estimatedItemSize={120}
      extraData={{
        viewing,
      }}
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
        }
      }}
      onViewableItemsChanged={({ viewableItems }) => {
        setViewing(() => viewableItems.map((item) => item.key))
      }}
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            onRefresh?.()

            return refetch()
          }}
        />
      }
      renderItem={({ item }) => (
        <PostCard
          label={label}
          post={item}
          viewing={focused ? viewing.includes(item.id) : false}
        />
      )}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 100,
        waitForInteraction: false,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  content: (inset?: boolean) => ({
    paddingBottom: inset ? runtime.insets.bottom : undefined,
  }),
  separator: {
    backgroundColor: theme.colors.gray.a6,
  },
}))
