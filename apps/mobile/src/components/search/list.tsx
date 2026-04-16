import { type ListRenderItem } from '@shopify/flash-list'
import { type ReactElement, useCallback } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { CommunityCard } from '~/components/communities/card'
import { PostCard } from '~/components/posts/card'
import { useSearch } from '~/hooks/queries/search/search'
import { useSearchHistory } from '~/hooks/search'
import { cardMaxWidth, iPad } from '~/lib/common'
import { listProps } from '~/lib/list'
import { usePreferences } from '~/stores/preferences'
import { useShallow } from 'zustand/react/shallow'
import { type Community } from '~/types/community'
import { type SearchTab } from '~/types/defaults'
import { type Post } from '~/types/post'
import { type SearchSort, type TopInterval } from '~/types/sort'
import { type User } from '~/types/user'

import { SensorList } from '../common/sensor/list'
import { UserCard } from '../users/card'
import { SearchHistory } from './history'

type Item = Post | Community | User

type Props = {
  community?: string
  header?: ReactElement
  interval?: TopInterval
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
  onChangeQuery,
  query,
  sort,
  style,
  type,
}: Props) {
  const t = useTranslations('component.search.list')

  const { feedCompact, themeOled } = usePreferences(
    useShallow((s) => ({
      feedCompact: s.feedCompact,
      themeOled: s.themeOled,
    })),
  )

  styles.useVariants({
    compact: feedCompact,
    iPad,
    oled: themeOled,
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
    <SensorList
      {...listProps}
      contentContainerStyle={StyleSheet.flatten([
        type !== 'post' && styles.content,
        style,
      ])}
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
          <Empty icon="magnifyingglass" message={t('empty')} />
        )
      }
      ListHeaderComponent={header}
      maintainVisibleContentPosition={{
        disabled: true,
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
  content: {
    paddingVertical: theme.space[2],
  },
  separator: {
    alignSelf: 'center',
    height: theme.space[4],
    variants: {
      compact: {
        true: {
          height: theme.space[2],
        },
      },
      iPad: {
        true: {
          maxWidth: cardMaxWidth,
        },
      },
      oled: {
        true: {
          backgroundColor: theme.colors.gray.border,
          height: 1,
        },
      },
    },
    width: '100%',
  },
}))
