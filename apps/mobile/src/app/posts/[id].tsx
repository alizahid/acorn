import { useIsFocused } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { useRef, useState } from 'react'
import { type TextInput } from 'react-native'
import { z } from 'zod'

import { CommentCard } from '~/components/comments/card'
import { CommentMoreCard } from '~/components/comments/more'
import { CommentsSortMenu } from '~/components/comments/sort'
import { CommentThreadCard } from '~/components/comments/thread'
import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { Pressable } from '~/components/common/pressable'
import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { PostCard } from '~/components/posts/card'
import { PostReplyCard } from '~/components/posts/reply'
import { useCommon } from '~/hooks/common'
import { usePost } from '~/hooks/queries/posts/post'
import { isUser, removePrefix } from '~/lib/reddit'
import { usePreferences } from '~/stores/preferences'
import { type Comment } from '~/types/comment'

const schema = z.object({
  commentId: z.string().min(1).optional().catch(undefined),
  id: z.string().catch('17jkixh'),
})

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const common = useCommon()
  const focused = useIsFocused()

  const { postCommentSort } = usePreferences()

  const list = useRef<FlashList<Comment>>(null)
  const reply = useRef<TextInput>(null)

  const [sort, setSort] = useState(postCommentSort)
  const [commentId, setCommentId] = useState<string>()
  const [user, setUser] = useState<string>()

  const { collapse, collapsed, comments, isFetching, post, refetch } = usePost({
    commentId: params.commentId,
    id: params.id,
    sort,
  })

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => <CommentsSortMenu onChange={setSort} value={sort} />,
      headerTitle: () =>
        post ? (
          <Pressable
            height="8"
            justify="center"
            onPress={() => {
              if (isUser(post.subreddit)) {
                router.navigate({
                  params: {
                    name: removePrefix(post.subreddit),
                    type: 'submitted',
                  },
                  pathname: '/users/[name]/[type]',
                })
              } else {
                router.navigate({
                  params: {
                    name: removePrefix(post.subreddit),
                  },
                  pathname: '/communities/[name]',
                })
              }
            }}
            px="3"
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
        ItemSeparatorComponent={() => <View height="2" />}
        ListEmptyComponent={
          isFetching ? post ? <Spinner m="4" /> : <Loading /> : <Empty />
        }
        ListHeaderComponent={
          <>
            {post ? (
              <PostCard expanded label="user" post={post} viewing={focused} />
            ) : null}

            {params.commentId ? (
              <CommentThreadCard
                onBack={() => {
                  list.current?.scrollToIndex({
                    animated: true,
                    index: 0,
                  })

                  router.setParams({
                    commentId: '',
                  })
                }}
              />
            ) : null}
          </>
        }
        data={comments}
        estimatedItemSize={72}
        getItemType={(item) => item.type}
        keyExtractor={(item) => item.data.id}
        keyboardDismissMode="on-drag"
        ref={list}
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

          return (
            <CommentMoreCard
              comment={item.data}
              onThread={(id) => {
                list.current?.scrollToIndex({
                  animated: true,
                  index: 0,
                })

                router.setParams({
                  commentId: id,
                })
              }}
              post={post}
            />
          )
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
