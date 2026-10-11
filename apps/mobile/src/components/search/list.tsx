import { type Community, type Post, type User } from '@acorn/reddit'
import { FlashList, type ListRenderItem } from '@shopify/flash-list'
import { type ReactElement, useCallback } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { Button } from '~/components/common/button'
import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { Spinner } from '~/components/common/spinner'
import { CommunityCard } from '~/components/communities/card'
import { PostCard } from '~/components/posts/card'
import { type ListProps } from '~/hooks/list'
import { useSearch } from '~/hooks/queries/search/search'
import { useSearchHistory } from '~/hooks/search'
import { usePreferences } from '~/stores/preferences'
import { type SearchTab } from '~/types/defaults'
import { type SearchSort, type TopInterval } from '~/types/sort'

import { UserCard } from '../users/card'
import { SearchHistory } from './history'

type Item = Post | Community | User

type Props = {
  community?: string
  header?: ReactElement
  interval?: TopInterval
  listProps?: ListProps
  onChangeQuery: (query: string) => void
  query: string
  sort?: SearchSort
  style?: StyleProp<ViewStyle>
  type: SearchTab
}

export function SearchList({
  community,
  header,
  interval,
  listProps,
  onChangeQuery,
  query,
  sort,
  style,
  type,
}: Props) {
  const t = useTranslations('component.search.list')

  const history = useSearchHistory(community)

  const { infiniteScrolling } = usePreferences(
    useShallow((state) => ({
      infiniteScrolling: state.infiniteScrolling,
    })),
  )

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    results,
  } = useSearch({
    community,
    interval,
    query,
    sort,
    type,
  })

  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => {
      if (type === 'community') {
        return <CommunityCard community={item as Community} />
      }

      if (type === 'user') {
        return <UserCard user={item as User} />
      }

      return <PostCard post={item as Post} />
    },
    [type],
  )

  return (
    <FlashList
      {...listProps}
      contentContainerStyle={style}
      data={results}
      getItemType={(item) => (type === 'post' ? (item as Post).type : type)}
      ItemSeparatorComponent={() =>
        type === 'post' ? <View style={styles.separator} /> : null
      }
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        isLoading ? (
          <Loading />
        ) : query.length > 1 ? (
          <Empty message={t('notFound')} />
        ) : history.history.length > 0 ? (
          <SearchHistory history={history} onChange={onChangeQuery} />
        ) : (
          <Empty icon="magnifying-glass" message={t(`empty.${type}`)} />
        )
      }
      ListFooterComponent={() =>
        isFetchingNextPage ? (
          <Spinner size="large" style={styles.more} />
        ) : infiniteScrolling ? null : hasNextPage ? (
          <Button
            label={t('more')}
            onPress={() => {
              fetchNextPage()
            }}
            style={styles.more}
          />
        ) : null
      }
      ListHeaderComponent={header}
      onEndReached={() => {
        if (infiniteScrolling && hasNextPage) {
          fetchNextPage()
        }
      }}
      onScrollBeginDrag={() => {
        history.save(query)
      }}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={renderItem}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  more: {
    alignSelf: 'center',
    marginVertical: theme.space[4],
  },
  separator: {
    backgroundColor: theme.colors.gray.border,
    height: 1,
  },
}))
