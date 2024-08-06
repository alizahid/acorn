import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRef } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { CommunityCard } from '~/components/communities/card'
import { useCommon } from '~/hooks/common'
import { useCommunities } from '~/hooks/queries/communities/communities'
import { type Community } from '~/types/community'

type Props = {
  type: 'communities' | 'users'
}

export function CommunitiesList({ type }: Props) {
  const { styles } = useStyles(stylesheet)

  const list = useRef<FlashList<Community>>(null)

  const common = useCommon()

  // @ts-expect-error -- go away
  useScrollToTop(list)

  const {
    communities,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    users,
  } = useCommunities()

  const data = {
    communities,
    users,
  }

  return (
    <FlashList
      {...common.listProps({
        header: true,
        tabBar: true,
      })}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner style={styles.spinner} /> : null
      }
      contentContainerStyle={styles.main(
        common.headerHeight,
        common.tabBarHeight,
      )}
      data={data[type]}
      estimatedItemSize={56}
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
        }
      }}
      ref={list}
      refreshControl={
        <RefreshControl offset={common.headerHeight} onRefresh={refetch} />
      }
      renderItem={({ item }) => <CommunityCard community={item} />}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (top: number, bottom: number) => ({
    paddingBottom: bottom + theme.space[2],
    paddingTop: top + theme.space[2],
  }),
  spinner: {
    margin: theme.space[4],
  },
}))
