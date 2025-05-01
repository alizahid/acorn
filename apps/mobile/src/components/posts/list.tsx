import { useIsFocused } from '@react-navigation/native'
import {
  type ContentStyle,
  FlashList,
  type ListRenderItem,
} from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { type ReactElement, useCallback, useRef, useState } from 'react'
import { type ViewabilityConfig } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

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
import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { View } from '../common/view'

const viewabilityConfig: ViewabilityConfig = {
  minimumViewTime: usePreferences.getState().seenOnScrollDelay * 1_000,
  viewAreaCoveragePercentThreshold: 60,
  waitForInteraction: false,
}

type Item = Post | Comment

type Props = PostsProps & {
  header?: ReactElement
  listProps?: ListProps<Item>
  onRefresh?: () => void
  style?: ContentStyle
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
  const focused = useIsFocused()

  const list = useRef<FlashList<Item>>(null)

  useScrollToTop(list, listProps)

  const { feedCompact, seenOnScroll, themeOled } = usePreferences()
  const { addPost } = useHistory()

  const { styles } = useStyles(stylesheet)

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

  return (
    <FlashList
      {...listProps}
      ItemSeparatorComponent={() => (
        <View style={styles.separator(themeOled, feedCompact)} />
      )}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="6" /> : null
      }
      ListHeaderComponent={header}
      contentContainerStyle={style}
      data={posts}
      extraData={{
        focused,
        viewing,
      }}
      getItemType={(item) => item.type}
      keyExtractor={(item) => {
        if (item.type === 'reply') {
          return `reply-${item.data.id}`
        }

        if (item.type === 'more') {
          return `more-${item.data.id}`
        }

        return item.id
      }}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
        }
      }}
      onViewableItemsChanged={({ viewableItems }) => {
        setViewing(() => viewableItems.map((item) => item.key))

        if (!seenOnScroll) {
          return
        }

        viewableItems
          .filter((item) => {
            const $item = item.item as Item

            return $item.type !== 'reply' && $item.type !== 'more'
          })
          .forEach((item) => {
            addPost({
              id: (item.item as Post).id,
            })
          })
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

const stylesheet = createStyleSheet((theme) => ({
  separator: (oled: boolean, compact: boolean) => ({
    alignSelf: 'center',
    backgroundColor: oled ? theme.colors.gray.border : undefined,
    height: oled ? 1 : theme.space[compact ? 2 : 4],
    maxWidth: iPad ? cardMaxWidth : undefined,
    width: '100%',
  }),
}))
