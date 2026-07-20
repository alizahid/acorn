import {
  FlashList,
  type FlashListRef,
  type ListRenderItem,
} from '@shopify/flash-list'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
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
import { FloatingButton } from '~/components/common/floating-button'
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
import { glass, heights, iPad } from '~/lib/common'
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

  styles.useVariants({
    iPad,
  })

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
    [comments, params.commentId, post, router, query],
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

            collapseThread({
              commentId: item.data.id,
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
    [collapse, collapseThread, collapsibleComments, post, router, sort],
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
            const current = list.current?.getFirstVisibleIndex() ?? 0

            const next = comments.findLastIndex(
              (item, index) =>
                index < current &&
                item.data.depth === 0 &&
                item.type === 'reply' &&
                !item.data.collapsed,
            )

            if (next < 0) {
              return
            }

            list.current?.scrollToIndex({
              animated: true,
              index: next,
            })
          }}
          onPress={() => {
            const offset = list.current?.getAbsoluteLastScrollOffset() ?? 0
            const first = list.current?.getFirstItemOffset() ?? 100

            if (Math.round(offset) < Math.round(first)) {
              list.current?.scrollToIndex({
                animated: true,
                index: 0,
              })

              return
            }

            const current = list.current?.getFirstVisibleIndex() ?? 0

            const next = comments.findIndex(
              (item, index) =>
                index > current &&
                item.data.depth === 0 &&
                item.type === 'reply' &&
                !item.data.collapsed,
            )

            list.current?.scrollToIndex({
              animated: true,
              index: next,
              viewOffset: 1,
            })
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
    paddingBottom: heights.floatingButton,
    variants: {
      iPad: {
        true: {
          paddingHorizontal: theme.space[4],
        },
      },
    },
  },
  header: {
    marginBottom: theme.space[2],
  },
  search: {
    borderBottomColor: theme.colors.gray.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    variants: {
      iPad: {
        true: {
          marginBottom: theme.space[4],
          marginHorizontal: -theme.space[4],
        },
      },
    },
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
