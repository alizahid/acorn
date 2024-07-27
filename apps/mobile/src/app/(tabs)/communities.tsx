import { FlashList } from '@shopify/flash-list'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { CommunityCard } from '~/components/communities/card'
import { useCommunities } from '~/hooks/queries/posts/communities'

export default function Screen() {
  const { styles } = useStyles(stylesheet)

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
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        !isFetching && isFetchingNextPage ? (
          <Spinner style={styles.spinner} />
        ) : null
      }
      data={communities}
      estimatedItemSize={200}
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
        }
      }}
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
  separator: {
    height: 1,
  },
  spinner: {
    margin: theme.space[4],
  },
}))
