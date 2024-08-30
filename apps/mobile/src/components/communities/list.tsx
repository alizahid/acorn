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
import { type Insets, useCommon } from '~/hooks/common'
import { type Community } from '~/types/community'

import { View } from '../common/view'

type Props = {
  communities: Array<string | Community>
  fetchNextPage: () => void
  hasNextPage: boolean
  insets: Insets
  isFetchingNextPage: boolean
  isLoading: boolean
  refetch: () => Promise<unknown>
}

export function CommunitiesList({
  communities,
  fetchNextPage,
  hasNextPage,
  insets,
  isFetchingNextPage,
  isLoading,
  refetch,
}: Props) {
  const common = useCommon()

  const { styles, theme } = useStyles(stylesheet)

  const list = useRef<FlashList<Community | string>>(null)

  // @ts-expect-error -- go away
  useScrollToTop(list)

  const sticky = communities
    .map((item, index) => (typeof item === 'string' ? index : null))
    .filter((item) => item !== null) as unknown as Array<number>

  const props = common.listProps(
    insets,
    [0, theme.space[4]],
    [theme.space[2], theme.space[2]],
  )

  return (
    <FlashList
      {...props}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListFooterComponent={() =>
        isFetchingNextPage ? <Spinner m="4" /> : null
      }
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
      refreshControl={
        <RefreshControl
          offset={props.progressViewOffset + theme.space[2]}
          onRefresh={refetch}
        />
      }
      renderItem={({ item, target }) => {
        if (typeof item === 'string') {
          return (
            <View
              my="2"
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

        return <CommunityCard community={item} />
      }}
      stickyHeaderIndices={sticky}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: {
    backgroundColor: theme.colors.gray.a2,
    paddingLeft: theme.space[4] + theme.space[7] + theme.space[4],
  },
  sticky: {
    backgroundColor: theme.colors.gray[2],
  },
}))
