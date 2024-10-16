import { useIsFocused } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { type UserPostsProps, useUserPosts } from '~/hooks/queries/user/posts'
import { listProps } from '~/lib/common'

import { CommentCard } from '../comments/card'
import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { View } from '../common/view'
import { type PostLabel } from '../posts/footer'

type Props = UserPostsProps & {
  label?: PostLabel
  onRefresh?: () => void
  tabs?: boolean
}

export function UserPostsList({
  interval,
  label,
  onRefresh,
  sort,
  tabs,
  type,
  username,
}: Props) {
  const router = useRouter()

  const focused = useIsFocused()

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

  const List = tabs ? Tabs.FlashList : FlashList

  return (
    <List
      {...listProps}
      ItemSeparatorComponent={() => <View height="2" />}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="6" /> : null
      }
      data={posts}
      estimatedItemSize={120}
      extraData={{
        viewing,
      }}
      keyExtractor={(item) => item.data.id}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
        }
      }}
      onViewableItemsChanged={({ viewableItems }) => {
        setViewing(() => viewableItems.map((item) => item.key))
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
      viewabilityConfig={{
        itemVisiblePercentThreshold: 100,
      }}
    />
  )
}
