import { useIsFocused, useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { type ReactElement, useRef, useState } from 'react'
import { type ViewabilityConfigCallbackPairs } from 'react-native'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { useHistory } from '~/hooks/history'
import { type ListProps } from '~/hooks/list'
import { type PostsProps, usePosts } from '~/hooks/queries/posts/posts'
import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

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

  const viewabilityConfigCallbackPairs = useRef<ViewabilityConfigCallbackPairs>(
    [
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

          viewableItems.forEach((item) => {
            addPost({
              id: (item.item as Post).id,
            })
          })
        },
        viewabilityConfig: {
          minimumViewTime: 3_000,
          viewAreaCoveragePercentThreshold: 60,
        },
      },
    ],
  )

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
          offset={listProps?.progressViewOffset}
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
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
    />
  )
}
