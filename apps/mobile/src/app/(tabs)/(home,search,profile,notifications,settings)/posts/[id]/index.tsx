import {
  FlashList,
  type FlashListRef,
  type ListRenderItem,
} from '@shopify/flash-list'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useHeaderHeight } from 'expo-router/react-navigation'
import fuzzysort from 'fuzzysort'
import { create } from 'mutative'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'use-intl'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { CommentCard } from '~/components/comments/card'
import { CommentMoreCard } from '~/components/comments/more'
import { Empty } from '~/components/common/empty'
import {
  FloatingButton,
  FloatingButtonSize,
} from '~/components/common/floating-button'
import { Icon } from '~/components/common/icon'
import { RefreshControl } from '~/components/common/refresh-control'
import { SearchBox } from '~/components/common/search'
import { Spinner } from '~/components/common/spinner'
import { CommunityHeader } from '~/components/communities/header'
import { PostCard } from '~/components/posts/card'
import { PostHeader } from '~/components/posts/header'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useListProps } from '~/hooks/list'
import { usePost } from '~/hooks/queries/posts/post'
import { glass } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type Comment } from '~/types/comment'

const schema = z.object({
  commentId: z.string().min(1).optional().catch(undefined),
  id: z.string().catch('17jkixh'),
})

export type PostParams = z.infer<typeof schema>

export default function Screen() {
  const router = useRouter()
  const params = schema.parse(useLocalSearchParams())

  const headerHeight = useHeaderHeight()

  const a11y = useTranslations('a11y')

  const { collapsibleComments, replyPost, skipComment, sortPostComments } =
    usePreferences(
      useShallow((state) => ({
        collapsibleComments: state.collapsibleComments,
        replyPost: state.replyPost,
        skipComment: state.skipComment,
        sortPostComments: state.sortPostComments,
      })),
    )

  const list = useRef<FlashListRef<Comment>>(null)

  const [sort, setSort] = useState(sortPostComments)
  const [query, setQuery] = useState('')

  const [queryText] = useDebounce(query, 500)

  const {
    collapse,
    collapseThread,
    comments: data,
    isFetching,
    post,
    refetch,
  } = usePost({
    commentId: params.commentId,
    id: params.id,
    sort,
  })

  const previous = useRef(params.id)

  const comments = useMemo(() => {
    if (queryText.length === 0) {
      return data
    }

    return fuzzysort
      .go(queryText, data, {
        key: 'data.body',
      })
      .map((item) =>
        create(item.obj, (draft) => {
          draft.data.depth = 0
        }),
      )
  }, [data, queryText])

  const scrollToComment = useCallback(
    (direction: 'up' | 'down') => {
      // FlashList's viewport ignores the transparent header inset, so its
      // first visible index is the item hidden under the header. Find the
      // item straddling the header's bottom edge instead (-1 = list header).
      const headerBottom =
        (list.current?.getAbsoluteLastScrollOffset() ?? 0) +
        headerHeight -
        (list.current?.getFirstItemOffset() ?? 0)

      let current = list.current?.getFirstVisibleIndex() ?? 0

      for (;;) {
        const layout = list.current?.getLayout(current)

        if (!layout) {
          break
        }

        if (layout.y > headerBottom) {
          current -= 1

          break
        }

        if (layout.y + layout.height > headerBottom) {
          break
        }

        current += 1
      }

      const isTarget = (item: Comment, index: number) =>
        (direction === 'down' ? index > current : index < current) &&
        item.data.depth === 0 &&
        item.type === 'reply' &&
        !item.data.collapsed

      const next =
        direction === 'down'
          ? comments.findIndex(isTarget)
          : comments.findLastIndex(isTarget)

      if (next < 0) {
        return
      }

      list.current?.scrollToIndex({
        animated: true,
        index: next,
        viewOffset: -headerHeight + 1,
      })
    },
    [comments, headerHeight],
  )

  useEffect(() => {
    if (previous.current !== params.id) {
      list.current?.scrollToOffset({
        animated: true,
        offset: 0,
      })

      previous.current = params.id
    }
  }, [params.id])

  const header = useMemo(
    () => (
      <View style={styles.header}>
        <SearchBox onChange={setQuery} style={styles.search} value={query} />

        {post ? <PostCard expanded post={post} /> : null}

        {params.commentId ? (
          <PostHeader
            onPress={(next) => {
              list.current?.scrollToIndex({
                animated: true,
                index: 1,
                viewOffset: -headerHeight,
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
    [comments, headerHeight, params.commentId, post, router, query],
  )

  const renderItem: ListRenderItem<Comment> = useCallback(
    ({ item }) => {
      if (item.type === 'more') {
        return (
          <CommentMoreCard
            comment={item.data}
            onThread={(id) => {
              list.current?.scrollToIndex({
                animated: true,
                index: 1,
                viewOffset: -headerHeight,
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
          onCollapse={() => {
            if (!collapsibleComments) {
              return
            }

            collapse({
              commentId: item.data.id,
            })
          }}
          onCollapseThread={() => {
            if (!collapsibleComments) {
              return
            }

            const index = collapseThread({
              commentId: item.data.id,
            })

            requestAnimationFrame(() => {
              list.current?.scrollToIndex({
                index,
                viewOffset: -headerHeight,
              })
            })
          }}
          onPress={() => {
            if (!collapsibleComments) {
              return
            }

            collapse({
              commentId: item.data.id,
            })
          }}
        />
      )
    },
    [
      collapse,
      collapseThread,
      collapsibleComments,
      headerHeight,
      post,
      router,
      sort,
    ],
  )

  const listProps = useListProps(true)

  return (
    <>
      {post ? (
        <Stack.Title asChild>
          <CommunityHeader post={post} />
        </Stack.Title>
      ) : null}

      <Stack.Toolbar placement="right">
        <Stack.Toolbar.View>
          <SortIntervalMenu
            onChange={(next) => {
              setSort(next.sort)
            }}
            sort={sort}
            style={styles.sort}
            type="comment"
          />
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      <FlashList
        {...listProps}
        contentContainerStyle={styles.content}
        data={comments}
        extraData={{
          commentId: params.commentId,
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        initialScrollIndex={params.commentId ? 0 : undefined}
        keyExtractor={(item) => {
          if (item.type === 'more') {
            return `${item.type}-${item.data.parentId}`
          }

          return `${item.type}-${item.data.id}`
        }}
        ListEmptyComponent={() =>
          isFetching ? (
            <Spinner size="large" style={styles.spinner} />
          ) : (
            <Empty />
          )
        }
        ListHeaderComponent={header}
        ref={list}
        refreshControl={<RefreshControl onRefresh={refetch} />}
        renderItem={renderItem}
      />

      {replyPost && post ? (
        <FloatingButton
          label={a11y('createComment')}
          onPress={() => {
            router.navigate({
              params: {
                id: params.id,
              },
              pathname: '/posts/[id]/reply',
            })
          }}
          side={replyPost}
        >
          <Icon
            name="arrow-bend-up-left-bold"
            uniProps={(theme) => ({
              color: theme.colors.blue.accent,
            })}
          />
        </FloatingButton>
      ) : null}

      {skipComment && comments.length > 0 ? (
        <FloatingButton
          label={a11y('skipComment')}
          onLongPress={() => {
            scrollToComment('up')
          }}
          onPress={() => {
            scrollToComment('down')
          }}
          side={skipComment}
        >
          <Icon name="arrow-down-bold" />
        </FloatingButton>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    paddingBottom: FloatingButtonSize,
  },
  header: {
    marginBottom: theme.space[2],
  },
  search: {
    borderBottomColor: theme.colors.gray.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  separator: {
    height: theme.space[2],
  },
  sort: {
    gap: theme.space[1],
    paddingHorizontal: glass ? theme.space[1] : 0,
  },
  spinner: {
    margin: theme.space[4],
  },
}))
