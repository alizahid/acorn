import { useIsFocused, useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { type ReactElement, useRef, useState } from 'react'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { useHistory } from '~/hooks/history'
import { type PostsProps, usePosts } from '~/hooks/queries/posts/posts'
import { listProps } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { View } from '../common/view'
import { type PostLabel } from './footer'

type Props = PostsProps & {
  header?: ReactElement
  label?: PostLabel
  onRefresh?: () => void
}

export function PostList({
  community,
  header,
  interval,
  label,
  onRefresh,
  sort,
}: Props) {
  const list = useRef<FlashList<Post>>(null)

  const focused = useIsFocused()

  useScrollToTop(list)

  const { dimSeen, feedCompact, mediaOnRight, seenOnScroll } = usePreferences()

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    posts,
    refetch,
  } = usePosts({
    community,
    interval,
    sort,
  })

  const { addPost, seen } = useHistory(posts.map((post) => post.id))

  const [viewing, setViewing] = useState<Array<string>>([])

  return (
    <FlashList
      {...listProps}
      ItemSeparatorComponent={() => <View height={feedCompact ? '2' : '4'} />}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="6" /> : null
      }
      ListHeaderComponent={header}
      data={posts}
      estimatedItemSize={feedCompact ? 112 : 120}
      extraData={{
        viewing,
      }}
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
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
      renderItem={({ item }) => (
        <PostCard
          compact={feedCompact}
          label={label}
          post={item}
          reverse={mediaOnRight}
          seen={dimSeen ? seen.includes(item.id) : false}
          viewing={focused ? viewing.includes(item.id) : false}
        />
      )}
      viewabilityConfigCallbackPairs={[
        {
          onViewableItemsChanged({ viewableItems }) {
            setViewing(() => viewableItems.map((item) => item.key))
          },
          viewabilityConfig: {
            itemVisiblePercentThreshold: 100,
          },
        },
        {
          onViewableItemsChanged({ viewableItems }) {
            if (!seenOnScroll) {
              return
            }

            viewableItems.forEach((item) => {
              void addPost((item.item as Post).id)
            })
          },
          viewabilityConfig: {
            itemVisiblePercentThreshold: 100,
            minimumViewTime: 3_000,
          },
        },
      ]}
    />
  )
}
