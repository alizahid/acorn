import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRef, useState } from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import {
  type FeedType,
  type TopInterval,
  usePosts,
} from '~/hooks/queries/posts/posts'
import { type Post } from '~/types/post'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'

type Props = {
  interval?: TopInterval
  subreddit?: string
  type: FeedType
}

export function PostList({ interval, subreddit, type }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const list = useRef<FlashList<Post>>(null)

  // @ts-expect-error -- go away
  useScrollToTop(list)

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    posts,
    refetch,
  } = usePosts(type, interval, subreddit)

  const [viewing, setViewing] = useState<Array<string>>([])

  const estimatedItemSize =
    theme.space[3] + // title padding
    theme.typography[3].lineHeight + // title
    theme.space[3] + // title padding
    theme.space[3] + // footer padding
    theme.space[2] + // subreddit
    theme.space[2] + // gap
    theme.typography[2].lineHeight + // meta
    theme.space[3] // footer padding

  return (
    <FlashList
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        isRefetching ? null : isLoading ? <Loading /> : <Empty />
      }
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner style={styles.spinner} /> : null
      }
      data={posts}
      estimatedItemSize={estimatedItemSize}
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
      ref={list}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ item }) => (
        <PostCard
          feedType={type}
          interval={interval}
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
