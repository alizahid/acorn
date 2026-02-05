import { type FlashListRef, type ListRenderItem } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { type ReactElement, useCallback, useRef } from 'react'
import {
  type StyleProp,
  type ViewabilityConfig,
  type ViewStyle,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { useHistory } from '~/hooks/history'
import { type ListProps } from '~/hooks/list'
import { type PostsProps, usePosts } from '~/hooks/queries/posts/posts'
import { useScrollToTop } from '~/hooks/scroll-top'
import { cardMaxWidth, iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type Comment } from '~/types/comment'
import { type Post } from '~/types/post'

import { CommentCard } from '../comments/card'
import { Button } from '../common/button'
import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { SensorList } from '../common/sensor/list'
import { View } from '../common/view'

const viewabilityConfig: ViewabilityConfig = {
  minimumViewTime: usePreferences.getState().seenOnScrollDelay * 1000,
  waitForInteraction: false,
}

type Item = Post | Comment

type Props = PostsProps & {
  header?: ReactElement
  listProps?: ListProps<Item>
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

  useScrollToTop(list, listProps)

  const { feedCompact, infiniteScrolling, seenOnScroll, themeOled } =
    usePreferences()
  const { addPost } = useHistory()

  styles.useVariants({
    compact: feedCompact,
    iPad,
    oled: themeOled,
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

  return (
    <SensorList
      {...listProps}
      contentContainerStyle={style}
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
          <Spinner style={styles.spinner} />
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
      maintainVisibleContentPosition={{
        disabled: true,
      }}
      onEndReached={() => {
        if (!infiniteScrolling) {
          return
        }

        if (hasNextPage) {
          fetchNextPage()
        }
      }}
      onViewableItemsChanged={({ changed }) => {
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
      }}
      ref={list}
      refreshControl={
        <RefreshControl
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
  more: {
    alignSelf: 'center',
    marginBottom: theme.space[4] * 2,
    marginTop: theme.space[4] * 2,
    variants: {
      iPad: {
        true: {
          marginBottom: theme.space[4],
        },
      },
    },
  },
  separator: {
    alignSelf: 'center',
    height: theme.space[4],
    variants: {
      compact: {
        true: {
          height: theme.space[2],
        },
      },
      iPad: {
        true: {
          maxWidth: cardMaxWidth,
        },
      },
      oled: {
        true: {
          backgroundColor: theme.colors.gray.border,
          height: 1,
        },
      },
    },
    width: '100%',
  },
  spinner: {
    height: theme.space[7],
    marginBottom: theme.space[4] * 2,
    marginTop: theme.space[4] * 2,
    variants: {
      iPad: {
        true: {
          marginBottom: theme.space[4],
        },
      },
    },
  },
}))
