import { FlashList } from '@shopify/flash-list'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { CommentCard } from '~/components/comments/card'
import { CommentMoreCard } from '~/components/comments/more'
import { Empty } from '~/components/common/empty'
import { Pressable } from '~/components/common/pressable'
import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { PostCard } from '~/components/posts/card'
import { useCommon } from '~/hooks/common'
import { usePost } from '~/hooks/queries/posts/post'

type Params = {
  id: string
}

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = useLocalSearchParams<Params>()

  const common = useCommon()

  const { styles } = useStyles(stylesheet)

  const { comments, isFetching, post, refetch } = usePost(params.id)

  useFocusEffect(() => {
    if (!post) {
      return
    }

    navigation.setOptions({
      headerTitle: () => (
        <Pressable
          onPress={() => {
            router.navigate(`/communities/${post.subreddit}`)
          }}
          style={styles.header}
        >
          <Text weight="bold">{post.subreddit}</Text>
        </Pressable>
      ),
    })
  })

  return (
    <FlashList
      {...common.listProps({
        header: true,
      })}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        isFetching ? <Spinner style={styles.spinner} /> : <Empty />
      }
      ListHeaderComponent={
        post ? (
          <PostCard expanded post={post} style={styles.post} viewing />
        ) : null
      }
      contentContainerStyle={styles.main(
        common.headerHeight,
        common.insets.bottom,
      )}
      data={comments}
      estimatedItemSize={72}
      getItemType={(item) => item.type}
      keyExtractor={(item) => item.data.id}
      refreshControl={
        <RefreshControl offset={common.headerHeight} onRefresh={refetch} />
      }
      renderItem={({ item }) => {
        if (item.type === 'reply') {
          return <CommentCard comment={item.data} postId={post?.id} />
        }

        return <CommentMoreCard comment={item.data} post={post} />
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: {
    height: theme.space[8],
    justifyContent: 'center',
    paddingHorizontal: theme.space[3],
  },
  main: (top: number, bottom: number) => ({
    paddingBottom: bottom,
    paddingTop: top,
  }),
  post: {
    marginBottom: theme.space[2],
  },
  separator: {
    height: theme.space[2],
  },
  spinner: {
    margin: theme.space[4],
  },
}))
