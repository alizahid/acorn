import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRef } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { CommunityCard } from '~/components/communities/card'
import { useCommon } from '~/hooks/common'
import { type Community } from '~/types/community'

import { View } from '../common/view'

type Props = {
  communities: Array<string | Community>
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  isLoading: boolean
  refetch: () => Promise<unknown>
}

export function CommunitiesList({
  communities,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  refetch,
}: Props) {
  const common = useCommon()

  const { styles } = useStyles(stylesheet)

  const list = useRef<FlashList<Community | string>>(null)

  // @ts-expect-error -- go away
  useScrollToTop(list)

  const sticky = communities
    .map((item, index) => (typeof item === 'string' ? index : null))
    .filter((item) => item !== null) as unknown as Array<number>

  return (
    <FlashList
      {...common.listProps}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="4" /> : null
      }
      contentContainerStyle={styles.content}
      data={communities}
      estimatedItemSize={56}
      getItemType={(item) =>
        typeof item === 'string' ? 'header' : 'community'
      }
      keyExtractor={(item) => (typeof item === 'string' ? item : item.id)}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage()
        }
      }}
      ref={list}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ index, item, target }) => {
        if (typeof item === 'string') {
          return (
            <View
              // my="2"
              pr="4"
              py="2"
              style={[
                styles.header,
                target === 'StickyHeader' && styles.sticky,
              ]}
            >
              <Text color="accent" weight="bold">
                {item.toUpperCase()}
              </Text>
            </View>
          )
        }

        const previous = typeof communities[index - 1] === 'string'
        const next = typeof communities[index + 1] === 'string'

        return (
          <CommunityCard community={item} style={styles.card(previous, next)} />
        )
      }}
      stickyHeaderIndices={sticky}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  card: (previous: boolean, next: boolean) => ({
    marginBottom: next ? theme.space[2] : undefined,
    marginTop: previous ? theme.space[2] : undefined,
  }),
  content: {
    paddingBottom: theme.space[2],
  },
  header: {
    backgroundColor: theme.colors.gray.a2,
    paddingLeft: theme.space[4] + theme.space[7] + theme.space[4],
  },
  sticky: {
    backgroundColor: theme.colors.gray[2],
  },
}))
