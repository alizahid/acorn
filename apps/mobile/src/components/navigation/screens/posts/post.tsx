import { useIsFocused } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { compact } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Share } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { z } from 'zod'

import { CommentCard } from '~/components/comments/card'
import { CommentMoreCard } from '~/components/comments/more'
import { Empty } from '~/components/common/empty'
import { Pressable } from '~/components/common/pressable'
import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'
import { PostCard } from '~/components/posts/card'
import { PostHeader } from '~/components/posts/header'
import { usePost } from '~/hooks/queries/posts/post'
import { listProps } from '~/lib/common'
import { removePrefix } from '~/lib/reddit'
import { usePreferences } from '~/stores/preferences'
import { type Comment } from '~/types/comment'

type ListItem = 'post' | 'header' | Comment | 'empty'

const schema = z.object({
  commentId: z.string().min(0).optional().catch(undefined),
  id: z.string().catch('17jkixh'),
})

export function PostScreen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const focused = useIsFocused()

  const { sortPostComments } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const list = useRef<FlashList<ListItem>>(null)

  const { collapse, collapsed, comments, isFetching, post, refetch } = usePost({
    commentId: params.commentId,
    id: params.id,
    sort: sortPostComments,
  })

  const [viewing, setViewing] = useState<Array<number>>([])

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <HeaderButton
            icon="ArrowBendUpLeft"
            onPress={() => {
              router.navigate({
                params: {
                  id: params.id,
                },
                pathname: '/posts/[id]/reply',
              })
            }}
          />

          {post ? (
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
          ) : null}
        </>
      ),
      headerTitle: () =>
        post ? (
          <Pressable
            height="8"
            justify="center"
            onPress={() => {
              if (post.subreddit.startsWith('u/')) {
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
        ) : undefined,
    })
  })

  useEffect(() => {
    if (!post || !params.commentId) {
      return
    }

    setTimeout(() => {
      list.current?.scrollToIndex({
        animated: true,
        index: 1,
      })
    }, 300)
  }, [params.commentId, post])

  const data = useMemo(
    () =>
      compact([
        'post' as const,
        'header' as const,
        ...(comments.length > 0 ? comments : ['empty' as const]),
      ]),
    [comments],
  )

  return (
    <>
      <FlashList
        {...listProps}
        ItemSeparatorComponent={() => <View height="2" />}
        contentContainerStyle={styles.content}
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

          if (item.type === 'reply') {
            return 'reply'
          }

          return 'more'
        }}
        keyExtractor={(item) => {
          if (typeof item === 'string') {
            return item
          }

          if (item.type === 'reply') {
            return `reply-${item.data.id}`
          }

          return `more-${item.data.parentId}`
        }}
        keyboardDismissMode="on-drag"
        onViewableItemsChanged={({ viewableItems }) => {
          setViewing(() =>
            viewableItems
              .filter(
                (item) => item.key === 'post' || item.key.startsWith('reply'),
              )
              .map((item) => item.index ?? 0),
          )
        }}
        ref={list}
        refreshControl={<RefreshControl onRefresh={refetch} />}
        renderItem={({ item, target }) => {
          if (typeof item === 'string') {
            if (item === 'post') {
              return post ? (
                <PostCard
                  expanded
                  label="user"
                  post={post}
                  viewing={focused ? viewing.includes(0) : false}
                />
              ) : (
                <Spinner m="4" size="large" />
              )
            }

            if (item === 'header') {
              return (
                <PostHeader
                  commentId={params.commentId}
                  onPress={() => {
                    list.current?.scrollToIndex({
                      animated: true,
                      index: 1,
                    })

                    router.setParams({
                      commentId: '',
                    })
                  }}
                  sticky={target === 'StickyHeader'}
                />
              )
            }

            return isFetching ? <Spinner m="4" /> : <Empty />
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
                  router.navigate({
                    params: {
                      commentId: item.data.id,
                      id: params.id,
                      user: item.data.user.name,
                    },
                    pathname: '/posts/[id]/reply',
                  })
                }}
              />
            )
          }

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
        }}
        stickyHeaderIndices={[1]}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
        }}
      />

      {comments.length > 0 ? (
        <HeaderButton
          contrast
          hitSlop={theme.space[4]}
          icon="ArrowDown"
          onPress={() => {
            if (viewing.includes(0)) {
              list.current?.scrollToIndex({
                animated: true,
                index: 2,
                viewOffset: 48,
              })

              return
            }

            const previous = viewing[0] ?? 0

            const next = data.findIndex((item, index) => {
              if (typeof item === 'string') {
                return false
              }

              return index > previous && item.data.depth === 0
            })

            list.current?.scrollToIndex({
              animated: true,
              index: next,
              viewOffset: 48,
            })
          }}
          style={[styles.action, styles.skip]}
          weight="bold"
        />
      ) : null}
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  action: {
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    bottom: theme.space[4],
    position: 'absolute',
  },
  back: {
    backgroundColor: theme.colors.gray.a9,
    left: theme.space[4],
  },
  content: {
    paddingBottom: theme.space[6] + theme.space[8],
  },
  skip: {
    backgroundColor: theme.colors.accent.a9,
    right: theme.space[4],
  },
}))
