import { useIsFocused, useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRef, useState } from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { PostCard } from '~/components/posts/card'
import { type Insets, useCommon } from '~/hooks/common'
import { type UserPostsProps, useUserPosts } from '~/hooks/queries/user/posts'
import { type Post } from '~/types/post'
import { type Profile } from '~/types/user'

import { Empty } from '../common/empty'
import { Loading } from '../common/loading'
import { type PostLabel } from '../posts/footer'
import { UserFollowCard } from './follow'

type Props = UserPostsProps & {
  insets: Insets
  label?: PostLabel
  onRefresh?: () => void
  profile?: Profile
}

export function UserPostsList({
  insets = [],
  interval,
  label,
  onRefresh,
  profile,
  sort,
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
      data={posts}
      drawDistance={common.frame.height}
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
          offset={props.progressViewOffset}
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
        itemVisiblePercentThreshold: 100,
        waitForInteraction: false,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  separator: {
    backgroundColor: theme.colors.gray.a6,
    height: 1,
  },
  spinner: {
    margin: theme.space[4],
  },
}))
