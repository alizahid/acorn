import { useIsFocused } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { useMemo, useRef, useState } from 'react'
import { Share, type TextInput } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { CommentCard } from '~/components/comments/card'
import { CommentMoreCard } from '~/components/comments/more'
import { CommentsSortMenu } from '~/components/comments/sort'
import { Empty } from '~/components/common/empty'
import { Pressable } from '~/components/common/pressable'
import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'
import { PostCard } from '~/components/posts/card'
import { PostReplyCard } from '~/components/posts/reply'
import { usePost } from '~/hooks/queries/posts/post'
import { listProps } from '~/lib/common'
import { isUser, removePrefix } from '~/lib/reddit'
import { usePreferences } from '~/stores/preferences'
import { type Comment } from '~/types/comment'
import { type Post } from '~/types/post'

const schema = z.object({
  commentId: z.string().min(0).optional().catch(undefined),
  id: z.string().catch('17jkixh'),
})

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const focused = useIsFocused()

  const t = useTranslations('screen.posts.post')

  const { sortPostComments, update } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const list = useRef<FlashList<Post | Comment | string>>(null)
  const reply = useRef<TextInput>(null)

  const [commentId, setCommentId] = useState<string>()
  const [user, setUser] = useState<string>()

  const { collapse, collapsed, comments, isFetching, post, refetch } = usePost({
    commentId: params.commentId,
    id: params.id,
    sort: sortPostComments,
  })

  const [viewing, setViewing] = useState<Array<string>>([])

  useFocusEffect(() => {
    if (!post) {
      return
    }

    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          icon="Share"
          onPress={() => {
            const url = new URL(post.permalink, 'https://reddit.com')

            void Share.share({
              message: post.title,
              url: url.toString(),
            })
          }}
        />
      ),
      headerTitle: () => (
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
      ),
    })
  })

  const data = useMemo(() => {
    const items: Array<Post | Comment | string> = [post ?? 'post', 'header']

    if (comments.length > 0) {
      items.push(...comments)
    } else {
      items.push('empty')
    }

    return items
  }, [comments, post])

  return (
    <>
      <FlashList
        {...listProps}
        ItemSeparatorComponent={() => <View height="2" />}
        data={data}
        estimatedItemSize={72}
        extraData={{
          commentId: params.commentId,
          viewing,
        }}
        getItemType={(item) => {
          if (typeof item === 'string') {
            return item
          }

          if (item.type === 'more' || item.type === 'reply') {
            return 'comment'
          }

          return 'post'
        }}
        keyExtractor={(item) => {
          if (typeof item === 'string') {
            return item
          }

          if (item.type === 'more' || item.type === 'reply') {
            return item.data.id
          }

          return 'post'
        }}
        keyboardDismissMode="on-drag"
        onViewableItemsChanged={({ viewableItems }) => {
          setViewing(() => viewableItems.map((item) => item.key))
        }}
        ref={list}
        refreshControl={<RefreshControl onRefresh={refetch} />}
        renderItem={({ item }) => {
          if (typeof item === 'string') {
            if (item === 'header') {
              return (
                <View align="center" direction="row" style={styles.header}>
                  {params.commentId ? (
                    <HeaderButton
                      icon="ArrowLeft"
                      onPress={() => {
                        list.current?.scrollToIndex({
                          animated: true,
                          index: 1,
                        })

                        router.setParams({
                          commentId: '',
                        })
                      }}
                    />
                  ) : null}

                  <Text ml={params.commentId ? undefined : '3'} weight="bold">
                    {t('comments')}
                  </Text>

                  <CommentsSortMenu
                    onChange={(next) => {
                      update({
                        sortPostComments: next,
                      })
                    }}
                    style={styles.menu}
                    value={sortPostComments}
                  />
                </View>
              )
            }

            if (item === 'empty') {
              return isFetching ? (
                <Spinner m="4" size={post ? 'small' : 'large'} />
              ) : (
                <Empty />
              )
            }

            return null
          }

          if (item.type === 'reply') {
            return (
              <CommentCard
                collapsed={collapsed.includes(item.data.id)}
                comment={item.data}
                onPress={() => {
                  collapse({
                    commentId: item.data.id,
                  })
                }}
                onReply={() => {
                  setCommentId(item.data.id)
                  setUser(item.data.user.name)

                  reply.current?.focus()
                }}
              />
            )
          }

          if (item.type === 'more') {
            return (
              <CommentMoreCard
                comment={item.data}
                onThread={(id) => {
                  list.current?.scrollToIndex({
                    animated: true,
                    index: 1,
                  })

                  router.setParams({
                    commentId: id,
                  })
                }}
                post={post}
              />
            )
          }

          return (
            <PostCard
              expanded
              label="user"
              post={item}
              viewing={focused ? viewing.includes('post') : false}
            />
          )
        }}
        stickyHeaderIndices={[1]}
        viewabilityConfig={{
          waitForInteraction: false,
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
    backgroundColor: theme.colors.gray[2],
  },
  menu: {
    marginLeft: 'auto',
  },
}))
