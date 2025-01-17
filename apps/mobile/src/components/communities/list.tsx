import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useRef } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { Text } from '~/components/common/text'
import { CommunityCard } from '~/components/communities/card'
import { type ListProps } from '~/hooks/list'
import { type Community } from '~/types/community'

import { Icon } from '../common/icon'
import { View } from '../common/view'

type Item = string | Community

type Props = {
  communities: Array<Item>
  isLoading: boolean
  listProps?: ListProps
  refetch: () => Promise<unknown>
}

export function CommunitiesList({
  communities,
  isLoading,
  listProps,
  refetch,
}: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const list = useRef<FlashList<Item>>(null)

  useScrollToTop(list)

  return (
    <FlashList
      {...listProps}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      data={communities}
      estimatedItemSize={56}
      getItemType={(item) =>
        typeof item === 'string' ? 'header' : 'community'
      }
      keyExtractor={(item) => (typeof item === 'string' ? item : item.id)}
      ref={list}
      refreshControl={
        <RefreshControl
          offset={listProps?.progressViewOffset}
          onRefresh={refetch}
        />
      }
      renderItem={({ index, item }) => {
        if (typeof item === 'string') {
          return (
            <View pr="4" py="2" style={styles.header}>
              {item === 'favorites' ? (
                <Icon
                  color={theme.colors.accent.accent}
                  name="Star"
                  size={theme.typography[3].lineHeight}
                  weight="duotone"
                />
              ) : (
                <Text style={styles.favorite} weight="bold">
                  {item.toUpperCase()}
                </Text>
              )}
            </View>
          )
        }

        const previous = typeof communities[index - 1] === 'string'
        const next =
          typeof communities[index + 1] === 'string' ||
          index + 1 === communities.length

        return (
          <CommunityCard community={item} style={styles.card(previous, next)} />
        )
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  card: (previous: boolean, next: boolean) => ({
    marginBottom: next ? theme.space[2] : undefined,
    marginTop: previous ? theme.space[2] : undefined,
  }),
  favorite: {
    color: theme.colors.accent.accent,
  },
  header: {
    backgroundColor: theme.colors.gray.bgAlt,
    paddingLeft: theme.space[4] * 2 + theme.space[7],
  },
}))
