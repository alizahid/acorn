import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { type Insets, useCommon } from '~/hooks/common'
import { useComments } from '~/hooks/queries/user/comments'
import { removePrefix } from '~/lib/reddit'
import { type Profile } from '~/types/user'

import { CommentCard } from '../comments/card'
import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { Pressable } from '../common/pressable'
import { UserFollowCard } from './follow'

type Props = {
  insets: Insets
  onRefresh?: () => void
  profile?: Profile
  user: string
}

export function UserCommentsList({
  insets = [],
  onRefresh,
  profile,
  user,
}: Props) {
  const router = useRouter()

  const { styles } = useStyles(stylesheet)

  const common = useCommon()

  const {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useComments(user)

  const props = common.listProps(insets)

  return (
    <FlashList
      {...props}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner style={styles.spinner} /> : null
      }
      ListHeaderComponent={
        profile ? <UserFollowCard profile={profile} /> : null
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
          offset={props.progressViewOffset}
          onRefresh={() => {
            onRefresh?.()

            return refetch()
          }}
        />
      }
      renderItem={({ item }) => {
        if (item.type === 'reply') {
          return (
            <Pressable
              onPress={() => {
                router.navigate({
                  params: {
                    id: removePrefix(item.data.postId),
                  },
                  pathname: '/posts/[id]',
                })
              }}
            >
              <CommentCard comment={item.data} />
            </Pressable>
          )
        }

        return null
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  separator: {
    height: theme.space[2],
  },
  spinner: {
    margin: theme.space[4],
  },
}))
