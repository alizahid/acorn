import { FlashList } from '@shopify/flash-list'
import { useLocalSearchParams } from 'expo-router'
import HandWavingIcon from 'react-native-phosphor/src/duotone/HandWaving'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { CommentCard } from '~/components/comments/card'
import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { PostCard } from '~/components/posts/card'
import { usePost } from '~/hooks/queries/posts/post'
import { type FeedType } from '~/hooks/queries/posts/posts'
import { getColorForIndex } from '~/lib/colors'

type Params = {
  feedType?: FeedType
  id: string
}

export default function Screen() {
  const frame = useSafeAreaFrame()

  const params = useLocalSearchParams<Params>()

  const { styles, theme } = useStyles(stylesheet)

  const { comments, isLoading, isRefetching, post, refetch } = usePost(
    params.id,
  )

  return (
    <FlashList
      ListEmptyComponent={
        isRefetching ? null : isLoading ? <Loading /> : <Empty />
      }
      ListFooterComponent={() => (
        <HandWavingIcon
          color={theme.colors.grayA[2]}
          size={theme.space[9]}
          style={styles.footer}
        />
      )}
      ListHeaderComponent={
        post ? (
          <PostCard
            body
            feedType={params.feedType}
            linkable={false}
            margin={theme.space[1]}
            post={post}
            style={styles.post}
            subreddit={post.subreddit}
            viewing
          />
        ) : null
      }
      data={comments}
      estimatedItemSize={frame.width}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ index, item }) => (
        <CommentCard
          comment={item}
          postId={post?.id}
          style={{
            backgroundColor: theme.colors[`${getColorForIndex(index)}A`][2],
          }}
        />
      )}
      scrollIndicatorInsets={{
        bottom: 1,
        right: 1,
        top: 1,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  footer: {
    marginHorizontal: 'auto',
    marginVertical: theme.space[4],
  },
  post: {
    padding: theme.space[1],
  },
}))
