import { LegendList, type LegendListRef } from '@legendapp/list'
import { useIsFocused } from '@react-navigation/native'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useStyles } from 'react-native-unistyles'
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
import { estimateHeight, useList } from '~/hooks/list'
import { usePost } from '~/hooks/queries/posts/post'
import { iPad } from '~/lib/common'
import { removePrefix } from '~/lib/reddit'
import { usePreferences } from '~/stores/preferences'
import { type Comment } from '~/types/comment'

const schema = z.object({
  commentId: z.string().min(1).optional().catch(undefined),
  id: z.string().catch('17jkixh'),
})

export type PostParams = z.infer<typeof schema>

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const focused = useIsFocused()

  const { replyPost, sortPostComments, themeOled } = usePreferences()

  const { theme } = useStyles()

  const list = useRef<LegendListRef>(null)

  const [sort, setSort] = useState(sortPostComments)

  const listProps = useList({
    padding: {
      bottom: theme.space[8] + theme.space[4] + theme.space[4],
      horizontal: iPad ? theme.space[4] : undefined,
      top: iPad ? theme.space[4] : undefined,
    },
  })

  const { collapse, comments, isFetching, post, refetch } = usePost({
    commentId: params.commentId,
    id: params.id,
    sort,
  })

  // const viewing = useRef<Array<number>>([])

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

  const header = useMemo(
    () => (
      <View mb={themeOled ? '1' : '2'}>
        {post ? (
          <PostCard expanded label="user" post={post} viewing={focused} />
        ) : (
          <Spinner m="4" size="large" />
        )}

        {params.commentId ? (
          <PostHeader
            onPress={(next) => {
              list.current?.scrollToIndex({
                animated: true,
                index: 0,
              })

              router.setParams({
                commentId: next ?? '',
              })
            }}
            parentId={comments[0]?.data.parentId}
          />
        ) : null}
      </View>
    ),
    [comments, focused, params.commentId, post, router, themeOled],
  )

  const renderItem = useCallback(
    (item: Comment) => {
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
            sort={sort}
          />
        )
      }

      return (
        <CommentCard
          collapsed={item.data.collapsed}
          comment={item.data}
          onPress={() => {
            collapse({
              commentId: item.data.id,
            })
          }}
        />
      )
    },
    [collapse, post, router, sort],
  )

  return (
    <>
      <LegendList
        {...listProps}
        ItemSeparatorComponent={() => <View height={themeOled ? '1' : '2'} />}
        ListEmptyComponent={() =>
          isFetching ? <Spinner m="4" size="large" /> : <Empty />
        }
        ListHeaderComponent={header}
        data={comments}
        extraData={{
          commentId: params.commentId,
        }}
        getEstimatedItemSize={(index, item) =>
          estimateHeight({
            index,
            item,
            type: 'comment',
          })
        }
        initialScrollIndex={params.commentId ? 0 : undefined}
        keyExtractor={(item) => `${item.type}-${item.data.id}`}
        keyboardDismissMode="on-drag"
        // onViewableItemsChanged={({ viewableItems }) => {
        //   viewing.current = viewableItems
        //     .filter((item) => {
        //       const comment = item.item as Comment

        //       return comment.type === 'reply' && !comment.data.collapsed
        //     })
        //     .map((item) => item.index)
        // }}
        // recycleItems
        ref={list}
        refreshControl={
          <RefreshControl
            offset={listProps.progressViewOffset}
            onRefresh={refetch}
          />
        }
        renderItem={({ item }) => renderItem(item)}
        // viewabilityConfig={{
        //   itemVisiblePercentThreshold: 60,
        // }}
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

      {/* {skipComment && comments.length > 0 ? (
        <FloatingButton
          icon="ArrowDown"
          onLongPress={() => {
            const previous = viewing.current[0] ?? 0

            const next = comments.findLastIndex(
              (item, index) =>
                index < previous &&
                item.data.depth === 0 &&
                item.type === 'reply' &&
                !item.data.collapsed,
            )

            list.current?.scrollToIndex({
              animated: true,
              index: next,
              viewOffset: listProps.progressViewOffset,
            })
          }}
          onPress={() => {
            const offset =
              list.current?.recyclerlistview_unsafe?.getCurrentScrollOffset()

            if (offset !== undefined && offset < 100) {
              list.current?.scrollToIndex({
                animated: true,
                index: 0,
                viewOffset: listProps.progressViewOffset,
              })

              return
            }

            const previous = comments.findIndex(
              (item, index) =>
                index >
                  ((viewing.current[0] === 0 ? -1 : viewing.current[0]) ?? 0) &&
                item.data.depth === 0 &&
                item.type === 'reply' &&
                !item.data.collapsed,
            )

            const next = comments.findIndex(
              (item, index) =>
                index > previous &&
                item.data.depth === 0 &&
                item.type === 'reply' &&
                !item.data.collapsed,
            )

            list.current?.scrollToIndex({
              animated: true,
              index: next,
              viewOffset: listProps.progressViewOffset,
            })
          }}
          side={skipComment}
        />
      ) : null} */}
    </>
  )
}
