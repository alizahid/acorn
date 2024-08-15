import { useIsFocused } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { useRef, useState } from 'react'
import { type TextInput, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { z } from 'zod'

import { CommentCard } from '~/components/comments/card'
import { CommentMoreCard } from '~/components/comments/more'
import { CommentsSortMenu } from '~/components/comments/sort'
import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { Pressable } from '~/components/common/pressable'
import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { PostCard } from '~/components/posts/card'
import { PostReplyCard } from '~/components/posts/reply'
import { useCommon } from '~/hooks/common'
import { usePost } from '~/hooks/queries/posts/post'
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  commentId: z.string().optional(),
  id: z.string().catch('17jkixh'),
})

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const common = useCommon()
  const focused = useIsFocused()

  const { postCommentSort } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const reply = useRef<TextInput>(null)

  const [sort, setSort] = useState(postCommentSort)
  const [commentId, setCommentId] = useState<string>()
  const [user, setUser] = useState<string>()

  const { collapse, collapsed, comments, isFetching, post, refetch } = usePost(
    params.id,
    sort,
  )

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => <CommentsSortMenu onChange={setSort} value={sort} />,
      headerTitle: () =>
        post ? (
          <Pressable
            onPress={() => {
              router.navigate(`/communities/${post.subreddit}`)
            }}
            style={styles.header}
          >
            <Text weight="bold">{post.subreddit}</Text>
          </Pressable>
        ) : null,
    })
  })

  const props = common.listProps(['top', 'header'])

  return (
    <>
      <FlashList
        {...props}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          isFetching ? (
            post ? (
              <Spinner style={styles.spinner} />
            ) : (
              <Loading />
            )
          ) : (
            <Empty />
          )
        }
        ListHeaderComponent={
          post ? (
            <PostCard expanded label="user" post={post} viewing={focused} />
          ) : null
        }
        data={comments}
        estimatedItemSize={72}
        getItemType={(item) => item.type}
        keyExtractor={(item) => item.data.id}
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl
            offset={props.progressViewOffset}
            onRefresh={refetch}
          />
        }
        renderItem={({ item }) => {
          if (item.type === 'reply') {
            const hidden = collapsed.includes(item.data.id)

            return (
              <Pressable
                onPress={() => {
                  collapse({
                    commentId: item.data.id,
                    hide: !hidden,
                  })
                }}
              >
                <CommentCard
                  collapsed={hidden}
                  comment={item.data}
                  onReply={() => {
                    setCommentId(item.data.id)
                    setUser(item.data.user.name)

                    reply.current?.focus()
                  }}
                />
              </Pressable>
            )
          }

          return <CommentMoreCard comment={item.data} post={post} />
        }}
      />

      <PostReplyCard
        commentId={commentId}
        onReset={() => {
          if (!post) {
            return
          }

          setCommentId(undefined)
          setUser(undefined)
        }}
        postId={post?.id}
        ref={reply}
        user={user}
      />
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: {
    height: theme.space[8],
    justifyContent: 'center',
    paddingHorizontal: theme.space[3],
  },
  separator: {
    height: theme.space[2],
  },
  spinner: {
    margin: theme.space[4],
  },
}))
