import { FlashList } from '@shopify/flash-list'
import { useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { type FeedType, usePosts } from '~/hooks/queries/posts/posts'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'

type Props = {
  subreddit?: string
  type: FeedType
}

export function PostList({ subreddit, type }: Props) {
  const frame = useSafeAreaFrame()

  const { styles } = useStyles(stylesheet)

  const {
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    posts,
    refetch,
  } = usePosts(type, subreddit)

  const [viewing, setViewing] = useState<Array<string>>([])

  return (
    <FlashList
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        isRefetching ? null : isLoading ? <Loading /> : <Empty />
      }
      ListFooterComponent={() =>
        !isFetching && isFetchingNextPage ? (
          <Spinner style={styles.spinner} />
        ) : null
      }
      data={posts}
      estimatedItemSize={frame.width}
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
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ item }) => (
        <PostCard
          feedType={type}
          post={item}
          subreddit={subreddit}
          viewing={viewing.includes(item.id)}
        />
      )}
      scrollIndicatorInsets={{
        bottom: 1,
        right: 1,
        top: 1,
      }}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 80,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  separator: {
    height: theme.space[4],
  },
  spinner: {
    margin: theme.space[4],
  },
}))
