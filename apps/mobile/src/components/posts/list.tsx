import {
  FlashList,
  type FlashListRef,
  type ListRenderItem,
} from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { type ReactElement, useCallback, useRef, useState } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import Animated from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { useFocused } from '~/hooks/focus'
import { useHistory } from '~/hooks/history'
import { type ListProps } from '~/hooks/list'
import { type PostsProps, usePosts } from '~/hooks/queries/posts/posts'
import { useScrollToTop } from '~/hooks/scroll-top'
import { useStickyHeader } from '~/hooks/sticky-header'
import { cardMaxWidth, iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type Comment } from '~/types/comment'
import { type Post } from '~/types/post'

import { CommentCard } from '../comments/card'
import { Button } from '../common/button'
import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { View } from '../common/view'
import { type HeaderProps } from '../navigation/header'
import { StickyHeader } from '../navigation/sticky-header'

type Item = Post | Comment

type Props = PostsProps & {
  header?: ReactElement
  listProps?: ListProps<Item>
  onRefresh?: () => void
  sticky?: HeaderProps
  style?: StyleProp<ViewStyle>
}

const List = Animated.createAnimatedComponent(FlashList<Item>)

export function PostList({
  community,
  feed,
  header,
  interval,
  listProps,
  onRefresh,
  query,
  sort,
  sticky,
  style,
  user,
  userType,
}: Props) {
  const router = useRouter()

  const { focused } = useFocused()

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

  const [viewing, setViewing] = useState<Array<string>>([])

  const { onScroll, visible } = useStickyHeader()

  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => {
      if (item.type === 'reply') {
        return (
          <CommentCard
            comment={item.data}
            dull
            onPress={() => {
              router.push({
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

      return (
        <PostCard
          post={item}
          viewing={focused ? viewing.includes(item.id) : false}
        />
      )
    },
    [focused, router, viewing],
  )

  const Component = sticky ? List : FlashList<Item>

  return (
    <>
      {sticky ? <StickyHeader visible={visible} {...sticky} /> : null}

      <Component
        {...listProps}
        contentContainerStyle={style}
        data={posts}
        extraData={{
          focused,
          viewing,
        }}
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
        onScroll={sticky ? onScroll : undefined}
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
        viewabilityConfigCallbackPairs={[
          {
            onViewableItemsChanged({ viewableItems }) {
              setViewing(() => viewableItems.map((item) => item.key))
            },
            viewabilityConfig: {
              itemVisiblePercentThreshold: 100,
              minimumViewTime: 0,
              waitForInteraction: false,
            },
          },
          {
            onViewableItemsChanged({ viewableItems }) {
              if (!seenOnScroll) {
                return
              }

              const items = viewableItems.filter(
                (item) =>
                  item.item.type !== 'reply' && item.item.type !== 'more',
              )

              for (const item of items) {
                addPost({
                  id: (item.item as Post).id,
                })
              }
            },
            viewabilityConfig: {
              itemVisiblePercentThreshold: 100,
              minimumViewTime:
                usePreferences.getState().seenOnScrollDelay * 1000,
              waitForInteraction: false,
            },
          },
        ]}
      />
    </>
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
