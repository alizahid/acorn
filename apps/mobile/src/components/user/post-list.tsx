import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRef, useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { type UserPostsProps, useUserPosts } from '~/hooks/queries/user/posts'
import { type Post } from '~/types/post'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'

type Props = UserPostsProps & {
  inset?: boolean
}

export function UserPostList({ inset, interval, sort, type, username }: Props) {
  const insets = useSafeAreaInsets()

  const { styles } = useStyles(stylesheet)

  const list = useRef<FlashList<Post>>(null)

  // @ts-expect-error -- go away
  useScrollToTop(list)

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
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner style={styles.spinner} /> : null
      }
      contentContainerStyle={styles.main(inset ? insets.bottom : 0)}
      data={posts}
      estimatedItemSize={120}
      extraData={{
        viewing,
      }}
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
        }
      }}
      onViewableItemsChanged={({ viewableItems }) => {
        setViewing(() => viewableItems.map((item) => item.key))
      }}
      ref={list}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ item }) => (
        <PostCard post={item} viewing={viewing.includes(item.id)} />
      )}
      scrollIndicatorInsets={{
        bottom: 1,
        right: 1,
        top: 1,
      }}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 60,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (inset: number) => ({
    paddingBottom: inset,
  }),
  separator: {
    height: theme.space[5],
  },
  spinner: {
    margin: theme.space[4],
  },
}))
