import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { FlashList, type ListRenderItem } from '@shopify/flash-list'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
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
import { useFocused } from '~/hooks/focus'
import { ListFlags, useList } from '~/hooks/list'
import { usePost } from '~/hooks/queries/posts/post'
import { heights, iPad } from '~/lib/common'
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

  const a11y = useTranslations('a11y')

  const { collapsibleComments, replyPost, skipComment, sortPostComments } =
    usePreferences()

  const { styles } = useStyles(stylesheet)

  const { focused } = useFocused()

  const list = useRef<FlashList<Comment>>(null)

  const [sort, setSort] = useState(sortPostComments)
  const [playing, setPlaying] = useState(focused)

  const listProps = useList(ListFlags.BOTTOM)

  const { collapse, comments, isFetching, post, refetch } = usePost({
    commentId: params.commentId,
    id: params.id,
    sort,
  })

  const previous = useRef(params.id)
  const viewing = useRef(0)

  useEffect(() => {
    if (previous.current !== params.id) {
      list.current?.scrollToOffset({
        animated: true,
        offset: 0,
      })

      previous.current = params.id
    }
  }, [params.id])

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
              label={post.community.name}
              onPress={() => {
                if (post.community.name.startsWith('u/')) {
                  router.push({
                    params: {
                      name: removePrefix(post.community.name),
                    },
                    pathname: '/users/[name]',
                  })

                  return
                }

                router.push({
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
      <View mb="2">
        {post ? (
          <PostCard expanded post={post} viewing={playing} />
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
    [comments, params.commentId, playing, post, router],
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
    [collapse, collapsibleComments, post, router, sort],
  )

  return (
    <>
      <FlashList
        {...listProps}
        contentContainerStyle={styles.content}
        data={comments}
        extraData={{
          commentId: params.commentId,
          playing,
        }}
        ItemSeparatorComponent={() => <View height="2" />}
        initialScrollIndex={params.commentId ? 0 : undefined}
        keyExtractor={(item) => {
          if (item.type === 'more') {
            return `${item.type}-${item.data.parentId}`
          }

          return `${item.type}-${item.data.id}`
        }}
        ListEmptyComponent={() =>
          isFetching ? <Spinner m="4" size="large" /> : <Empty />
        }
        ListHeaderComponent={header}
        maintainVisibleContentPosition={{
          disabled: true,
        }}
        onScroll={(event) => {
          setPlaying(
            focused &&
              (list.current?.getFirstItemOffset() ?? 0) >
                event.nativeEvent.contentOffset.y,
          )
        }}
        onViewableItemsChanged={({ viewableItems }) => {
          const next = viewableItems.find(
            (item) =>
              item.item.type === 'reply' &&
              !item.item.data.collapsed &&
              item.item.data.depth === 0,
          )

          if (next?.index) {
            viewing.current = next.index
          }
        }}
        ref={list}
        refreshControl={<RefreshControl onRefresh={refetch} />}
        renderItem={renderItem}
        scrollEventThrottle={250}
        viewabilityConfig={{
          waitForInteraction: false,
        }}
      />

      {replyPost && post ? (
        <FloatingButton
          color="blue"
          icon="ArrowBendUpLeft"
          label={a11y('createComment')}
          onPress={() => {
            router.push({
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
          label={a11y('skipComment')}
          onLongPress={() => {
            const next = comments.findLastIndex(
              (item, index) =>
                index < viewing.current &&
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

            if (offset < first) {
              list.current?.scrollToIndex({
                animated: true,
                index: 0,
              })

              return
            }

            const next = comments.findIndex(
              (item, index) =>
                index > viewing.current &&
                item.data.depth === 0 &&
                item.type === 'reply' &&
                !item.data.collapsed,
            )

            list.current?.scrollToIndex({
              animated: true,
              index: next,
            })
          }}
          side={skipComment}
        />
      ) : null}
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: {
    paddingBottom: heights.floatingButton,
    paddingHorizontal: iPad ? theme.space[4] : undefined,
    paddingTop: iPad ? theme.space[4] : undefined,
  },
}))
