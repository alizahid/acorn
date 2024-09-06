import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import {
  useComments,
  type UserCommentsProps,
} from '~/hooks/queries/user/comments'
import { listProps } from '~/lib/common'
import { removePrefix } from '~/lib/reddit'

import { CommentCard } from '../comments/card'
import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { View } from '../common/view'

type Props = UserCommentsProps & {
  inset?: boolean
  onRefresh?: () => void
}

export function UserCommentsList({
  inset,
  interval,
  onRefresh,
  sort,
  username,
}: Props) {
  const router = useRouter()

  const { styles } = useStyles(stylesheet)

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
    username,
  })

  return (
    <FlashList
      {...listProps}
      ItemSeparatorComponent={() => <View height="2" />}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="4" /> : null
      }
      contentContainerStyle={styles.content(inset)}
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
                    id: removePrefix(item.data.postId),
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

const stylesheet = createStyleSheet((theme, runtime) => ({
  content: (inset?: boolean) => ({
    paddingBottom: inset ? runtime.insets.bottom : undefined,
  }),
}))
