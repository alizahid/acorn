import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import {
  type UserCommentsProps,
  useUserComments,
} from '~/hooks/queries/user/comments'
import { listProps } from '~/lib/common'

import { CommentCard } from '../comments/card'
import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { Refreshing } from '../common/refreshing'
import { View } from '../common/view'

type Props = UserCommentsProps & {
  onRefresh?: () => void
}

export function UserCommentsList({
  interval,
  onRefresh,
  sort,
  username,
}: Props) {
  const router = useRouter()

  const {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefreshing,
    refetch,
  } = useUserComments({
    interval,
    sort,
    username,
  })

  return (
    <>
      <FlashList
        {...listProps}
        ItemSeparatorComponent={() => <View height="4" />}
        ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
        ListFooterComponent={() =>
          isFetchingNextPage ? <Spinner m="6" /> : null
        }
        data={comments}
        estimatedItemSize={72}
        getItemType={(item) => item.type}
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
          if (item.type === 'reply') {
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

          return null
        }}
        scrollEnabled={comments.length > 0}
      />

      {isRefreshing ? <Refreshing /> : null}
    </>
  )
}
