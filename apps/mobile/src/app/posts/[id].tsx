import { FlashList } from '@shopify/flash-list'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { CommentCard } from '~/components/comments/card'
import { CommentMoreCard } from '~/components/comments/more'
import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { PostCard } from '~/components/posts/card'
import { usePost } from '~/hooks/queries/posts/post'

type Params = {
  id: string
}

export default function Screen() {
  const insets = useSafeAreaInsets()

  const navigation = useNavigation()

  const params = useLocalSearchParams<Params>()

  const { styles } = useStyles(stylesheet)

  const { comments, isLoading, isRefetching, post, refetch } = usePost(
    params.id,
  )

  useFocusEffect(() => {
    if (!post) {
      return
    }

    navigation.setOptions({
      title: post.subreddit,
    })
  })

  return (
    <FlashList
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        isRefetching ? null : isLoading ? <Loading /> : <Empty />
      }
      ListHeaderComponent={
        post ? (
          <PostCard
            body
            linkable={false}
            post={post}
            style={styles.post}
            viewing
          />
        ) : null
      }
      contentContainerStyle={styles.list(insets.bottom)}
      data={comments}
      estimatedItemSize={72}
      getItemType={(item) => item.type}
      keyExtractor={(item) => item.data.id}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ item }) => {
        if (item.type === 'reply') {
          return <CommentCard comment={item.data} postId={post?.id} />
        }

        return <CommentMoreCard comment={item.data} post={post} />
      }}
      scrollIndicatorInsets={{
        bottom: 1,
        right: 1,
        top: 1,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  list: (inset: number) => ({
    paddingBottom: inset,
  }),
  post: {
    marginBottom: theme.space[2],
  },
  separator: {
    height: theme.space[2],
  },
}))
