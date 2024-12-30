import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { type ListProps } from '~/hooks/list'
import { type CommentsProps, useComments } from '~/hooks/queries/user/comments'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { View } from '../common/view'
import { CommentCard } from './card'

type Props = CommentsProps & {
  listProps?: ListProps
  onRefresh?: () => void
}

export function CommentList({
  interval,
  listProps,
  onRefresh,
  sort,
  user,
}: Props) {
  const router = useRouter()

  const {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useComments({
    interval,
    sort,
    user,
  })

  return (
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
          offset={listProps?.progressViewOffset}
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
    />
  )
}
