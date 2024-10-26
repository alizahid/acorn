import { useIsFocused } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { useState } from 'react'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { type UserPostsProps, useUserPosts } from '~/hooks/queries/user/posts'
import { listProps } from '~/lib/common'
import { useHistory } from '~/stores/history'
import { usePreferences } from '~/stores/preferences'
import { type CommentReply } from '~/types/comment'
import { type Post } from '~/types/post'

import { CommentCard } from '../comments/card'
import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { View } from '../common/view'
import { type PostLabel } from '../posts/footer'

type Props = UserPostsProps & {
  label?: PostLabel
  onRefresh?: () => void
}

export function UserPostsList({
  interval,
  label,
  onRefresh,
  sort,

  type,
  username,
}: Props) {
  const router = useRouter()

  const focused = useIsFocused()

  const { dimSeen, feedCompact } = usePreferences()
  const { addPost, posts: seen } = useHistory()

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    posts,
    refetch,
  } = useUserPosts({
    interval,
    sort,
    type,
    username,
  })

  const [viewing, setViewing] = useState<Array<string>>([])

  return (
    <FlashList
      {...listProps}
      ItemSeparatorComponent={() => <View height="4" />}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="6" /> : null
      }
      data={posts}
      estimatedItemSize={feedCompact ? 112 : 120}
      extraData={{
        viewing,
      }}
      keyExtractor={(item) => item.data.id}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
        }
      }}
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            onRefresh?.()

            return refetch()
          }}
        />
      }
      renderItem={({ item }) => {
        if (item.type === 'comment') {
          return (
            <CommentCard
              comment={item.data}
              onPress={() => {
                router.navigate({
                  params: {
                    commentId: item.data.id,
                    id: item.data.postId,
                  },
                  pathname: '/posts/[id]',
                })
              }}
            />
          )
        }

        return (
          <PostCard
            compact={feedCompact}
            label={label}
            post={item.data}
            seen={dimSeen ? seen.includes(item.data.id) : false}
            viewing={focused ? viewing.includes(item.data.id) : false}
          />
        )
      }}
      scrollEnabled={posts.length > 0}
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
            viewableItems.forEach((item) => {
              const viewableItem = item.item as
                | {
                    data: CommentReply
                    type: 'comment'
                  }
                | {
                    data: Post
                    type: 'post'
                  }

              if (viewableItem.type === 'post') {
                addPost(viewableItem.data.id)
              }
            })
          },
          viewabilityConfig: {
            itemVisiblePercentThreshold: 100,
            minimumViewTime: 1_500,
          },
        },
      ]}
    />
  )
}
