import {
  FlashList,
  type FlashListProps,
  type FlashListRef,
  type ListRenderItem,
} from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { type ReactElement, useCallback, useRef } from 'react'
import {
  type StyleProp,
  View,
  type ViewabilityConfig,
  type ViewStyle,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { useHistory } from '~/hooks/history'
import { type ListProps } from '~/hooks/list'
import { type PostsProps, usePosts } from '~/hooks/queries/posts/posts'
import { cardMaxWidth, iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type Comment } from '~/types/comment'
import { type Post } from '~/types/post'

import { CommentCard } from '../comments/card'
import { Button } from '../common/button'
import { Empty } from '../common/empty'
import { Loading } from '../common/loading'

const viewabilityConfig: ViewabilityConfig = {
  minimumViewTime: usePreferences.getState().seenOnScrollDelay * 1000,
  waitForInteraction: false,
}

type Item = Post | Comment

type Props = PostsProps & {
  header?: ReactElement
  listProps?: ListProps
  onRefresh?: () => void
  style?: StyleProp<ViewStyle>
}

export function PostList({
  community,
  feed,
  header,
  interval,
  listProps,
  onRefresh,
  query,
  sort,
  style,
  user,
  userType,
}: Props) {
  const router = useRouter()

  const t = useTranslations('component.posts.list')

  const list = useRef<FlashListRef<Item>>(null)

  const { addPost } = useHistory()

  const { infiniteScrolling, seenOnScroll } = usePreferences(
    useShallow((state) => ({
      infiniteScrolling: state.infiniteScrolling,
      seenOnScroll: state.seenOnScroll,
    })),
  )

  styles.useVariants({
    iPad,
  })

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    posts,
    refetch,
  } = usePosts({
    community,
    feed,
    interval,
    query,
    sort,
    user,
    userType,
  })

  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => {
      if (item.type === 'reply') {
        return (
          <CommentCard
            comment={item.data}
            dull
            onPress={() => {
              router.navigate({
                params: {
                  commentId: item.data.id,
                  id: item.data.post.id,
                },
                pathname: '/posts/[id]',
              })
            }}
          />
        )
      }

      if (item.type === 'more') {
        return null
      }

      return <PostCard post={item} />
    },
    [router],
  )

  const onViewableItemsChanged: FlashListProps<Item>['onViewableItemsChanged'] =
    useCallback(
      ({ changed }) => {
        if (!seenOnScroll) {
          return
        }

        const items = changed.filter(
          (item) =>
            !item.isViewable &&
            item.item &&
            item.item.type !== 'reply' &&
            item.item.type !== 'more',
        )

        for (const item of items) {
          addPost({
            id: (item.item as Post).id,
          })
        }
      },
      [addPost, seenOnScroll],
    )

  return (
    <FlashList
      {...listProps}
      contentContainerStyle={[
        listProps?.contentContainerStyle,
        styles.content,
        style,
      ]}
      data={posts}
      getItemType={(item) => item.type}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      keyExtractor={(item) => {
        if (item.type === 'reply') {
          return `reply-${item.data.id}`
        }

        if (item.type === 'more') {
          return `more-${item.data.id}`
        }

        return item.id
      }}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? (
          <Spinner size="large" style={styles.more} />
        ) : infiniteScrolling ? null : hasNextPage ? (
          <Button
            label={t('more')}
            onPress={() => {
              fetchNextPage()
            }}
            style={styles.more}
          />
        ) : null
      }
      ListHeaderComponent={header}
      onEndReached={() => {
        if (!infiniteScrolling) {
          return
        }

        if (hasNextPage) {
          fetchNextPage()
        }
      }}
      onViewableItemsChanged={onViewableItemsChanged}
      ref={list}
      refreshControl={
        <RefreshControl
          offset={listProps?.contentContainerStyle.paddingTop}
          onRefresh={() => {
            onRefresh?.()

            return refetch()
          }}
        />
      }
      renderItem={renderItem}
      viewabilityConfig={viewabilityConfig}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    flexGrow: 1,
  },
  more: {
    alignSelf: 'center',
    marginTop: theme.space[4],
  },
  separator: {
    alignSelf: 'center',
    backgroundColor: theme.colors.gray.border,
    height: StyleSheet.hairlineWidth,
    variants: {
      iPad: {
        true: {
          maxWidth: cardMaxWidth,
        },
      },
    },
    width: '100%',
  },
}))
