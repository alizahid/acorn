import { FlashList } from '@shopify/flash-list'
import { useState } from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { useFrame } from '~/hooks/frame'
import { type FeedType, useFeed } from '~/hooks/queries/posts/feed'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'

type Props = {
  type: FeedType
}

export function PostList({ type }: Props) {
  const frame = useFrame()

  const { styles } = useStyles(stylesheet)

  const {
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    posts,
    refetch,
  } = useFeed(type)

  const [viewing, setViewing] = useState<Array<string>>([])

  return (
    <FlashList
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        !isFetching && isFetchingNextPage ? (
          <Spinner style={styles.spinner} />
        ) : null
      }
      contentContainerStyle={styles.list(
        frame.padding.top,
        frame.padding.bottom,
      )}
      data={posts}
      estimatedItemSize={frame.frame.width}
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
          viewing={viewing.includes(item.id)}
        />
      )}
      scrollIndicatorInsets={frame.scroll}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 60,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  list: (top: number, bottom: number) => ({
    paddingBottom: bottom,
    paddingTop: top,
  }),
  separator: {
    height: theme.space[4],
  },
  spinner: {
    margin: theme.space[4],
  },
}))
