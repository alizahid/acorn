import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useLocalSearchParams } from 'expo-router'
import { useRef } from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { z } from 'zod'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { CommunityCard } from '~/components/communities/card'
import { useCommon } from '~/hooks/common'
import { useCommunities } from '~/hooks/queries/communities/communities'
import { CommunitiesType, type Community } from '~/types/community'

const schema = z.object({
  type: z.enum(CommunitiesType).catch('communities'),
})

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const { styles, theme } = useStyles(stylesheet)

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

  const sticky = data[params.type]
    .map((item, index) => (typeof item === 'string' ? index : null))
    .filter((item) => item !== null) as unknown as Array<number>

  const props = common.listProps(
    ['top', 'bottom', 'communities', 'tabBar'],
    [-theme.space[2], theme.space[2]],
  )

  return (
    <FlashList
      {...props}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner style={styles.spinner} /> : null
      }
      data={data[params.type]}
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
        <RefreshControl offset={props.progressViewOffset} onRefresh={refetch} />
      }
      renderItem={({ item, target }) => {
        if (typeof item === 'string') {
          return (
            <View
              style={[
                styles.header,
                target === 'StickyHeader' &&
                  styles.sticky(props.progressViewOffset),
              ]}
            >
              <Text color="accent" weight="bold">
                {item.toUpperCase()}
              </Text>
            </View>
          )
        }

        return <CommunityCard community={item} />
      }}
      stickyHeaderIndices={sticky}
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
  spinner: {
    margin: theme.space[4],
  },
  sticky: (offset: number) => ({
    backgroundColor: theme.colors.gray[2],
    marginTop: offset,
  }),
}))
