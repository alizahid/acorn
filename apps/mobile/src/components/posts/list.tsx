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
import { Refreshing, type RefreshingProps } from '../common/refreshing'
import { View } from '../common/view'
import { type PostLabel } from './footer'

type Props = PostsProps & {
  header?: ReactElement
  label?: PostLabel
  onRefresh?: () => void
  refreshing?: RefreshingProps
}

export function PostList({
  community,
  feed,
  header,
  interval,
  label,
  onRefresh,
  refreshing,
  sort,
  user,
}: Props) {
  const list = useRef<FlashList<Post>>(null)

  const focused = useIsFocused()

  useScrollToTop(list)

  const { feedCompact, seenOnScroll } = usePreferences()
  const { addPost } = useHistory()

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefreshing,
    posts,
    refetch,
  } = usePosts({
    community,
    feed,
    interval,
    sort,
    user,
  })

  const [viewing, setViewing] = useState<Array<string>>([])

  return (
    <>
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
            label={label}
            post={item}
            viewing={focused ? viewing.includes(item.id) : false}
          />
        )}
        viewabilityConfigCallbackPairs={[
          {
            onViewableItemsChanged({ viewableItems }) {
              setViewing(() => viewableItems.map((item) => item.key))
            },
            viewabilityConfig: {
              viewAreaCoveragePercentThreshold: 100,
            },
          },
          {
            onViewableItemsChanged({ viewableItems }) {
              if (!seenOnScroll) {
                return
              }

              viewableItems.forEach((item) => {
                addPost({
                  id: (item.item as Post).id,
                })
              })
            },
            viewabilityConfig: {
              minimumViewTime: 3_000,
              viewAreaCoveragePercentThreshold: 100,
            },
          },
        ]}
      />

      {isRefreshing ? <Refreshing {...refreshing} /> : null}
    </>
  )
}
