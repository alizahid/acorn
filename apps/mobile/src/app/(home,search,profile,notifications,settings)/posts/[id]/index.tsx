import { useIsFocused } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { compact } from 'lodash'
import { useCallback, useMemo, useRef, useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { z } from 'zod'

import { CommentCard } from '~/components/comments/card'
import { CommentMoreCard } from '~/components/comments/more'
import { Empty } from '~/components/common/empty'
import { FloatingButton } from '~/components/common/floating-button'
import { Pressable } from '~/components/common/pressable'
import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { PostCard } from '~/components/posts/card'
import { PostHeader } from '~/components/posts/header'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useHistory } from '~/hooks/history'
import { useList } from '~/hooks/list'
import { usePost } from '~/hooks/queries/posts/post'
import { iPad } from '~/lib/common'
import { removePrefix } from '~/lib/reddit'
import { usePreferences } from '~/stores/preferences'
import { type Comment } from '~/types/comment'

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

  const { styles } = useStyles(stylesheet)

  const list = useRef<FlashList<ListItem>>(null)

  const [sort, setSort] = useState(sortPostComments)

  const listProps = useList()

  const { collapse, collapsed, comments, isFetching, post, refetch } = usePost({
    commentId: params.commentId,
    id: params.id,
    sort,
  })

  const [viewing, setViewing] = useState<Array<number>>([])

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <SortIntervalMenu
            onChange={(next) => {
              setSort(next.sort)
            }}
            sort={sort}
            type="comment"
          />
        ),
        headerTitle: () =>
          post ? (
            <Pressable
              height="8"
              justify="center"
              onPress={() => {
                if (post.community.name.startsWith('u/')) {
                  router.navigate({
                    params: {
                      name: removePrefix(post.community.name),
                    },
                    pathname: '/users/[name]',
                  })

                  return
                }

                router.navigate({
                  params: {
                    name: removePrefix(post.community.name),
                  },
                  pathname: '/communities/[name]',
                })
              }}
              px="3"
            >
              <Text weight="bold">{post.community.name}</Text>
            </Pressable>
          ) : undefined,
      })
    }, [navigation, post, router, sort]),
  )

  const data = useMemo(
    () =>
      compact([
        'post' as const,
        params.commentId ? ('header' as const) : undefined,
        ...(comments.length > 0 ? comments : ['empty' as const]),
      ]),
    [comments, params.commentId],
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
        initialScrollIndex={params.commentId ? 1 : undefined}
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
        renderItem={({ item }) => {
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
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 60,
        }}
      />

      {replyPost && post ? (
        <FloatingButton
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
          side={replyPost}
        />
      ) : null}

      {skipComment && comments.length > 0 ? (
        <FloatingButton
          icon="ArrowDown"
          onLongPress={() => {
            if (viewing.includes(0)) {
              list.current?.scrollToIndex({
                animated: true,
                index: 2,
                viewOffset: styles.offset.margin,
              })

              return
            }

            const previous = viewing[0] ?? 0

            const next = data.findLastIndex((item, index) => {
              if (typeof item === 'string') {
                return false
              }

              return index < previous && item.data.depth === 0
            })

            list.current?.scrollToIndex({
              animated: true,
              index: next,
              viewOffset: styles.offset.margin,
            })
          }}
          onPress={() => {
            if (viewing.includes(0)) {
              list.current?.scrollToIndex({
                animated: true,
                index: 2,
                viewOffset: styles.offset.margin,
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
              viewOffset: styles.offset.margin,
            })
          }}
          side={skipComment}
        />
      ) : null}
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  content: {
    paddingBottom:
      runtime.insets.bottom +
      theme.space[3] +
      theme.space[5] +
      theme.space[3] +
      theme.space[6] +
      theme.space[8] +
      (iPad ? theme.space[4] : 0),
    paddingHorizontal: iPad ? theme.space[4] : 0,
    paddingTop:
      runtime.insets.top + theme.space[8] + (iPad ? theme.space[4] : 0),
  },
  offset: {
    margin: runtime.insets.top + theme.space[8],
  },
}))
