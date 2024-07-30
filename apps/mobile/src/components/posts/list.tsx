import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRef, useState } from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { type PostsProps, usePosts } from '~/hooks/queries/posts/posts'
import { type Post } from '~/types/post'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'

export function PostList({
  interval,
  subreddit,
  type,
  userName,
  userType,
}: PostsProps) {
  const { styles } = useStyles(stylesheet)

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
  } = usePosts({
    interval,
    subreddit,
    type,
    userName,
    userType,
  })

  const [viewing, setViewing] = useState<Array<string>>([])

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
      ref={list}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ item }) => (
        <PostCard post={item} viewing={viewing.includes(item.id)} />
      )}
      scrollIndicatorInsets={{
        bottom: 1,
        right: 1,
        top: 1,
      }}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 60,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  separator: {
    height: theme.space[5],
  },
  spinner: {
    margin: theme.space[4],
  },
}))
