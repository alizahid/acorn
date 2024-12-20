import { useIsFocused } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { BlurView } from 'expo-blur'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { compact } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
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
import { useHistory } from '~/hooks/history'
import { useList } from '~/hooks/list'
import { usePost } from '~/hooks/queries/posts/post'
import { removePrefix } from '~/lib/reddit'
import { usePreferences } from '~/stores/preferences'
import { type Comment } from '~/types/comment'
import { type Side } from '~/types/preferences'

type ListItem = 'post' | 'header' | Comment | 'empty'

const schema = z.object({
  commentId: z.string().min(1).optional().catch(undefined),
  id: z.string().catch('17jkixh'),
})

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const focused = useIsFocused()

  const { replyPost, skipComment, sortPostComments } = usePreferences()
  const { addPost } = useHistory()

  const { styles, theme } = useStyles(stylesheet)

  const list = useRef<FlashList<ListItem>>(null)

  const [sort, setSort] = useState(sortPostComments)

  const listProps = useList()

  const { collapse, collapsed, comments, isFetching, post, refetch } = usePost({
    commentId: params.commentId,
    id: params.id,
    sort,
  })

  const [viewing, setViewing] = useState<Array<number>>([])

  useFocusEffect(() => {
    navigation.setOptions({
      headerTitle: () =>
        post ? (
          <Pressable
            height="8"
            justify="center"
            onPress={() => {
              if (post.community.name.startsWith('u/')) {
                router.push({
                  params: {
                    name: removePrefix(post.community.name),
                  },
                  pathname: '/users/[name]',
                })
              } else {
                router.push({
                  params: {
                    name: removePrefix(post.community.name),
                  },
                  pathname: '/communities/[name]',
                })
              }
            }}
            px="3"
          >
            <Text weight="bold">{post.community.name}</Text>
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
          if (viewableItems.find((item) => item.key === 'post')) {
            addPost({
              id: params.id,
            })
          }

          setViewing(() =>
            viewableItems
              .filter(
                (item) => item.key === 'post' || item.key.startsWith('reply'),
              )
              .map((item) => item.index ?? 0),
          )
        }}
        ref={list}
        refreshControl={
          <RefreshControl
            offset={listProps.progressViewOffset}
            onRefresh={refetch}
          />
        }
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
                  onChangeSort={setSort}
                  onPress={(next) => {
                    list.current?.scrollToIndex({
                      animated: true,
                      index: 1,
                    })

                    router.setParams({
                      commentId: next ?? '',
                    })
                  }}
                  parentId={
                    params.commentId ? comments[0]?.data.parentId : undefined
                  }
                  sort={sort}
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
          viewAreaCoveragePercentThreshold: 60,
        }}
      />

      {replyPost && post ? (
        <BlurView style={[styles.action, styles.reply(replyPost)]}>
          <HeaderButton
            color="blue"
            icon="ArrowBendUpLeft"
            onPress={() => {
              router.navigate({
                params: {
                  id: params.id,
                },
                pathname: '/posts/[id]/reply',
              })
            }}
            weight="bold"
          />
        </BlurView>
      ) : null}

      {skipComment && comments.length > 0 ? (
        <BlurView style={[styles.action, styles.skip(skipComment)]}>
          <HeaderButton
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
            weight="bold"
          />
        </BlurView>
      ) : null}
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  action: {
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    bottom:
      runtime.insets.bottom +
      theme.space[4] +
      theme.space[5] +
      theme.space[4] +
      theme.space[4],
    overflow: 'hidden',
    position: 'absolute',
  },
  back: {
    backgroundColor: theme.colors.gray.a9,
    left: theme.space[4],
  },
  content: {
    paddingBottom:
      runtime.insets.bottom +
      theme.space[4] +
      theme.space[5] +
      theme.space[4] +
      theme.space[6] +
      theme.space[8],
    paddingTop: runtime.insets.top + theme.space[8],
  },
  reply: (side: Side) => ({
    backgroundColor: theme.colors.blue.a4,
    left: side === 'left' ? theme.space[4] : undefined,
    right: side === 'right' ? theme.space[4] : undefined,
  }),
  skip: (side: Side) => ({
    backgroundColor: theme.colors.accent.a4,
    left: side === 'left' ? theme.space[4] : undefined,
    right: side === 'right' ? theme.space[4] : undefined,
  }),
}))
