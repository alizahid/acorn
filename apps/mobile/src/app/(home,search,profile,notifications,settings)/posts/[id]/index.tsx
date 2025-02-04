import { useIsFocused } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { without } from 'lodash'
import { useCallback, useRef, useState } from 'react'
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
import { useList } from '~/hooks/list'
import { usePost } from '~/hooks/queries/posts/post'
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

  const { replyPost, skipComment, sortPostComments } = usePreferences()

  const list = useRef<FlashList<Comment>>(null)

  const [sort, setSort] = useState(sortPostComments)

  const listProps = useList()

  const { collapse, collapsed, comments, isFetching, post, refetch } = usePost({
    commentId: params.commentId,
    id: params.id,
    sort,
  })

  const viewing = useRef<Array<number>>([])

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

  return (
    <>
      <FlashList
        {...listProps}
        ItemSeparatorComponent={() => <View height="2" />}
        ListEmptyComponent={() =>
          isFetching ? <Spinner m="4" size="large" /> : <Empty />
        }
        ListHeaderComponent={() => (
          <View mb="2">
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
        )}
        data={comments}
        estimatedFirstItemOffset={0}
        estimatedItemSize={200}
        extraData={{
          commentId: params.commentId,
        }}
        getItemType={(item) => item.type}
        initialScrollIndex={params.commentId ? 0 : undefined}
        keyExtractor={(item) => `${item.type}-${item.data.id}`}
        keyboardDismissMode="on-drag"
        onViewableItemsChanged={({ viewableItems }) => {
          viewing.current = viewableItems
            .filter((item) => (item.item as Comment).type === 'reply')
            .map((item) => item.index ?? 0)
        }}
        ref={list}
        refreshControl={
          <RefreshControl
            offset={listProps.progressViewOffset}
            onRefresh={refetch}
          />
        }
        renderItem={({ item }) => {
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
              collapsed={collapsed.includes(item.data.id)}
              comment={item.data}
              onPress={() => {
                collapse({
                  commentId: item.data.id,
                })
              }}
            />
          )
        }}
        scrollEventThrottle={64}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
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
            const previous = viewing.current[0] ?? 0

            const next = comments.findLastIndex(
              (item, index) =>
                index < previous &&
                item.data.depth === 0 &&
                !collapsed.includes(item.data.id),
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

            const ids = without(
              viewing.current,
              ...collapsed.map((id) =>
                comments.findIndex((comment) => comment.data.id === id),
              ),
            )

            const previous = comments.findIndex(
              (item, index) => index > (ids[0] ?? 0) && item.data.depth === 0,
            )

            const next = comments.findIndex(
              (item, index) =>
                index > previous &&
                item.data.depth === 0 &&
                !collapsed.includes(item.data.id),
            )

            list.current?.scrollToIndex({
              animated: true,
              index: next,
              viewOffset: listProps.progressViewOffset,
            })
          }}
          side={skipComment}
        />
      ) : null}
    </>
  )
}
