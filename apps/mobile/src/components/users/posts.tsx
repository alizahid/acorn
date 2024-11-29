import { useIsFocused } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { useState } from 'react'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { useHistory } from '~/hooks/history'
import { type UserPostsProps, useUserPosts } from '~/hooks/queries/user/posts'
import { listProps } from '~/lib/common'
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

  const { feedCompact, seenOnScroll } = usePreferences()
  const { addPost } = useHistory()

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
      ItemSeparatorComponent={() => <View height={feedCompact ? '2' : '4'} />}
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
            label={label}
            post={item.data}
            viewing={focused ? viewing.includes(item.data.id) : false}
          />
        )
      }}
      viewabilityConfigCallbackPairs={[
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
                addPost({
                  id: viewableItem.data.id,
                })
              }
            })
          },
          viewabilityConfig: {
            minimumViewTime: 3_000,
            viewAreaCoveragePercentThreshold: 60,
          },
        },
      ]}
    />
  )
}
