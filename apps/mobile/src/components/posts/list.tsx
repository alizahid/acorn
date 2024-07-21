import { FlashList } from '@shopify/flash-list'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { PostSkeleton } from '~/components/posts/skeleton'
import { type FeedType, useFeed } from '~/hooks/data/feed'
import { useFrame } from '~/hooks/frame'

type Props = {
  type: FeedType
}

export function PostList({ type }: Props) {
  const frame = useFrame()

  const { styles } = useStyles(stylesheet)

  const { fetchNextPage, hasNextPage, isFetchingNextPage, posts, refetch } =
    useFeed(type)

  return (
    <FlashList
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={() => (
        <>
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner style={styles.spinner} /> : null
      }
      contentContainerStyle={styles.list(
        frame.padding.top,
        frame.padding.bottom,
      )}
      data={posts}
      estimatedItemSize={frame.frame.width}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
        }
      }}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ item }) => <PostCard post={item} />}
      scrollIndicatorInsets={frame.scroll}
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
