import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRef } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { CommunityCard } from '~/components/communities/card'
import { useCommunities } from '~/hooks/queries/communities/communities'
import { type Community } from '~/types/community'

export default function Screen() {
  const { styles } = useStyles(stylesheet)

  const list = useRef<FlashList<Community>>(null)

  // @ts-expect-error -- go away
  useScrollToTop(list)

  const {
    communities,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useCommunities()

  return (
    <FlashList
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        !isFetching && isFetchingNextPage ? (
          <Spinner style={styles.spinner} />
        ) : null
      }
      data={communities}
      estimatedItemSize={56}
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
        }
      }}
      ref={list}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ item }) => <CommunityCard community={item} />}
      scrollIndicatorInsets={{
        bottom: 1,
        right: 1,
        top: 1,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  spinner: {
    margin: theme.space[4],
  },
}))
