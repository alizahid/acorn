import { FlashList, type ListRenderItem } from '@shopify/flash-list'
import { type ReactElement, useCallback } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { CommunityCard } from '~/components/communities/card'
import { PostCard } from '~/components/posts/card'
import { type ListProps } from '~/hooks/list'
import { useSearch } from '~/hooks/queries/search/search'
import { useSearchHistory } from '~/hooks/search'
import { cardMaxWidth, iPad } from '~/lib/common'
import { type Community } from '~/types/community'
import { type SearchTab } from '~/types/defaults'
import { type Post } from '~/types/post'
import { type SearchSort, type TopInterval } from '~/types/sort'
import { type User } from '~/types/user'

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

  styles.useVariants({
    iPad,
  })

  const history = useSearchHistory(community)

  const { isLoading, refetch, results } = useSearch({
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
      ListHeaderComponent={header}
      onScrollBeginDrag={() => {
        history.save(query)
      }}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={renderItem}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  separator: {
    alignSelf: 'center',
    backgroundColor: theme.colors.gray.border,
    height: 1,
    variants: {
      iPad: {
        true: {
          maxWidth: cardMaxWidth,
        },
      },
    },
    width: '100%',
  },
}))
