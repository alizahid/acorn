import { useIsFocused, useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRef, useState } from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { useCommon } from '~/hooks/common'
import { type UserPostsProps, useUserPosts } from '~/hooks/queries/user/posts'
import { type Post } from '~/types/post'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'

type Props = UserPostsProps & {
  header?: boolean
  inset?: boolean
  tabBar?: boolean
}

export function UserPostList({
  header,
  inset,
  interval,
  sort,
  tabBar,
  type,
  username,
}: Props) {
  const { styles } = useStyles(stylesheet)

  const list = useRef<FlashList<Post>>(null)

  const common = useCommon()
  const focused = useIsFocused()

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
      {...common.listProps({
        header,
        tabBar,
      })}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner style={styles.spinner} /> : null
      }
      contentContainerStyle={styles.main({
        header: header ? common.headerHeight : 0,
        inset: inset ? common.insets.bottom : 0,
        tabBar: tabBar ? common.tabBarHeight : 0,
      })}
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
      refreshControl={
        <RefreshControl
          offset={header ? common.headerHeight : 0}
          onRefresh={refetch}
        />
      }
      renderItem={({ item }) => (
        <PostCard
          post={item}
          viewing={focused ? viewing.includes(item.id) : false}
        />
      )}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 80,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: ({
    header,
    inset,
    tabBar,
  }: {
    header: number
    inset: number
    tabBar: number
  }) => ({
    paddingBottom: tabBar + inset,
    paddingTop: header,
  }),
  separator: {
    height: theme.space[5],
  },
  spinner: {
    margin: theme.space[4],
  },
}))
