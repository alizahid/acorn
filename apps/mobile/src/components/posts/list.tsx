import { LegendList, type LegendListRef } from '@legendapp/list'
import { useIsFocused, useScrollToTop } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import {
  type ReactElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { type ViewabilityConfigCallbackPairs } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { useHistory } from '~/hooks/history'
import { estimateHeight, type ListProps } from '~/hooks/list'
import { type PostsProps, usePosts } from '~/hooks/queries/posts/posts'
import { cardMaxWidth, iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type Comment } from '~/types/comment'
import { type Post } from '~/types/post'

import { CommentCard } from '../comments/card'
import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { View } from '../common/view'
import { type PostLabel } from './footer'

type Props = PostsProps & {
  header?: ReactElement
  label?: PostLabel
  listProps?: ListProps
  onRefresh?: () => void
}

export function PostList({
  community,
  feed,
  header,
  interval,
  label,
  listProps,
  onRefresh,
  query,
  sort,
  user,
  userType,
}: Props) {
  const router = useRouter()

  const list = useRef<LegendListRef>(null)

  const focused = useIsFocused()

  useScrollToTop(list)

  const { feedCompact, largeThumbnails, seenOnScroll, themeOled } =
    usePreferences()
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

  const viewabilityConfigCallbackPairs =
    useMemo<ViewabilityConfigCallbackPairs>(
      () => [
        {
          onViewableItemsChanged({ viewableItems }) {
            setViewing(() => viewableItems.map((item) => item.key))
          },
          viewabilityConfig: {
            viewAreaCoveragePercentThreshold: 60,
          },
        },
        {
          onViewableItemsChanged({ viewableItems }) {
            if (!seenOnScroll) {
              return
            }

            viewableItems
              .filter((item) => {
                const data = item.item as Post | Comment

                return data.type !== 'reply' && data.type !== 'more'
              })
              .forEach((item) => {
                addPost({
                  id: (item.item as Post).id,
                })
              })
          },
          viewabilityConfig: {
            viewAreaCoveragePercentThreshold: 60,
          },
        },
      ],
      [addPost, seenOnScroll],
    )

  const [viewing, setViewing] = useState<Array<string>>([])

  const renderItem = useCallback(
    (item: Post | Comment) => {
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

      return (
        <PostCard
          label={label}
          post={item}
          viewing={focused ? viewing.includes(item.id) : false}
        />
      )
    },
    [focused, label, router, viewing],
  )

  return (
    <LegendList
      {...listProps}
      ItemSeparatorComponent={() => (
        <View style={styles.separator(themeOled, feedCompact)} />
      )}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="6" /> : null
      }
      ListHeaderComponent={header}
      data={posts}
      extraData={{
        viewing,
      }}
      getEstimatedItemSize={(index, item) => {
        if (!(item as Post | Comment | undefined)) {
          return 100
        }

        if (item.type === 'reply' || item.type === 'more') {
          return estimateHeight({
            index,
            item,
            type: 'comment',
          })
        }

        return estimateHeight({
          compact: feedCompact,
          index,
          item,
          large: largeThumbnails,
          type: 'post',
        })
      }}
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
      // recycleItems
      ref={list}
      refreshControl={
        <RefreshControl
          offset={listProps?.progressViewOffset}
          onRefresh={() => {
            onRefresh?.()

            return refetch()
          }}
        />
      }
      renderItem={({ item }) => renderItem(item)}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
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
