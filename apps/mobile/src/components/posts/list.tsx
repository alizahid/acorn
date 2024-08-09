import { useIsFocused, useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRef, useState } from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { useCommon } from '~/hooks/common'
import { type PostsProps, usePosts } from '~/hooks/queries/posts/posts'
import { type Community } from '~/types/community'
import { type Post } from '~/types/post'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { CommunityJoinCard } from '../communities/join'
import { type PostLabel } from './footer'

type Props = PostsProps & {
  header?: boolean
  inset?: boolean
  label?: PostLabel
  onRefresh?: () => void
  profile?: Community
  tabBar?: boolean
}

export function PostList({
  community,
  header,
  inset,
  interval,
  label,
  onRefresh,
  profile,
  sort,
  tabBar,
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
  } = usePosts({
    community,
    interval,
    sort,
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
      ListHeaderComponent={
        profile ? <CommunityJoinCard community={profile} /> : null
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
    backgroundColor: theme.colors.gray.a3,
    height: 1,
  },
  spinner: {
    margin: theme.space[4],
  },
}))
