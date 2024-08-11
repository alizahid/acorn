import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRef } from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { CommunityCard } from '~/components/communities/card'
import { useCommon } from '~/hooks/common'
import { useCommunities } from '~/hooks/queries/communities/communities'
import { type CommunitiesType, type Community } from '~/types/community'

import { Text } from '../common/text'

type Props = {
  type: CommunitiesType
}

export function CommunitiesList({ type }: Props) {
  const { styles } = useStyles(stylesheet)

  const list = useRef<FlashList<Community | string>>(null)

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
        communities: true,
        tabBar: true,
      })}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner style={styles.spinner} /> : null
      }
      contentContainerStyle={styles.main(
        common.height.communities,
        common.height.tabBar,
      )}
      data={data[type]}
      estimatedItemSize={56}
      getItemType={(item) =>
        typeof item === 'string' ? 'header' : 'community'
      }
      keyExtractor={(item) => (typeof item === 'string' ? item : item.id)}
      onEndReached={() => {
        if (hasNextPage) {
          void fetchNextPage()
        }
      }}
      ref={list}
      refreshControl={
        <RefreshControl
          offset={common.height.communities}
          onRefresh={refetch}
        />
      }
      renderItem={({ item }) => {
        if (typeof item === 'string') {
          return (
            <View style={styles.header}>
              <Text color="accent" weight="bold">
                {item.toUpperCase()}
              </Text>
            </View>
          )
        }

        return <CommunityCard community={item} />
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: {
    backgroundColor: theme.colors.gray.a2,
    marginVertical: theme.space[2],
    paddingLeft: theme.space[4] + theme.space[7] + theme.space[4],
    paddingRight: theme.space[4],
    paddingVertical: theme.space[2],
  },
  main: (top: number, bottom: number) => ({
    paddingBottom: bottom + theme.space[2],
    paddingTop: top - theme.space[2],
  }),
  spinner: {
    margin: theme.space[4],
  },
  sticky: (offset: number) => ({
    backgroundColor: theme.colors.gray[2],
    marginTop: offset,
  }),
}))
