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
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
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
import { usePost } from '~/hooks/queries/posts/post'
import { listProps } from '~/lib/common'
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

  const focused = useIsFocused()

  const t = useTranslations('screen.posts.post')

  const { postCommentSort } = usePreferences()

  const { styles } = useStyles(stylesheet)

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
                  },
                  pathname: '/users/[name]',
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

  return (
    <>
      <FlashList
        {...listProps}
        ItemSeparatorComponent={() => <View height="2" />}
        ListEmptyComponent={
          isFetching ? post ? <Spinner m="4" /> : <Loading /> : <Empty />
        }
        ListHeaderComponent={
          <>
            {post ? (
              <PostCard expanded label="user" post={post} viewing={focused} />
            ) : null}

            <View
              align="center"
              direction="row"
              gap="4"
              justify="between"
              mb="2"
              pl="3"
              style={styles.header}
            >
              <Text weight="bold">{t('comments')}</Text>

              <CommentsSortMenu onChange={setSort} value={sort} />
            </View>

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
        refreshControl={<RefreshControl onRefresh={refetch} />}
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

const stylesheet = createStyleSheet((theme) => ({
  header: {
    backgroundColor: theme.colors.gray.a2,
  },
}))
