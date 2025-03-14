import { FlashList, type ListRenderItem } from '@shopify/flash-list'
import { type ReactElement, useCallback, useRef, useState } from 'react'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { CommunityCard } from '~/components/communities/card'
import { PostCard } from '~/components/posts/card'
import { type ListProps } from '~/hooks/list'
import { useSearch } from '~/hooks/queries/search/search'
import { useScrollToTop } from '~/hooks/scroll-top'
import { useSearchHistory } from '~/hooks/search'
import { usePreferences } from '~/stores/preferences'
import { type Community } from '~/types/community'
import { type SearchTab } from '~/types/defaults'
import { type Post } from '~/types/post'
import { type SearchSort, type TopInterval } from '~/types/sort'
import { type User } from '~/types/user'

import { View } from '../common/view'
import { UserCard } from '../users/card'
import { SearchHistory } from './history'

type Item = Post | Community | User

type Props = {
  community?: string
  focused?: boolean
  header?: ReactElement
  interval?: TopInterval
  listProps?: ListProps<Item>
  onChangeQuery: (query: string) => void
  query: string
  sort?: SearchSort
  style?: StyleProp<ViewStyle>
  type: SearchTab
}

export function SearchList({
  community,
  focused,
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

  const list = useRef<FlashList<Item>>(null)

  useScrollToTop(list, listProps)

  const { styles } = useStyles(stylesheet)

  const { feedCompact, themeOled } = usePreferences()

  const history = useSearchHistory(community)

  const { isLoading, refetch, results } = useSearch({
    community,
    interval,
    query,
    sort,
    type,
  })

  const [viewing, setViewing] = useState<Array<string>>([])

  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => {
      if (type === 'community') {
        return <CommunityCard community={item as Community} />
      }

      if (type === 'user') {
        return <UserCard user={item as User} />
      }

      return (
        <PostCard
          post={item as Post}
          viewing={focused ? viewing.includes(item.id) : false}
        />
      )
    },
    [focused, type, viewing],
  )

  return (
    <FlashList
      {...listProps}
      ItemSeparatorComponent={() =>
        type === 'post' ? (
          <View style={styles.separator(themeOled, feedCompact)} />
        ) : null
      }
      ListEmptyComponent={
        isLoading ? (
          <Loading />
        ) : query.length > 1 ? (
          <Empty icon="SmileySad" message={t('notFound')} />
        ) : history.history.length > 0 ? (
          <SearchHistory history={history} onChange={onChangeQuery} />
        ) : (
          <Empty icon="MagnifyingGlass" message={t('empty')} weight="duotone" />
        )
      }
      ListHeaderComponent={header}
      contentContainerStyle={StyleSheet.flatten([
        type !== 'post' && styles.content,
        style,
      ])}
      data={results}
      estimatedItemSize={type === 'post' ? (feedCompact ? 120 : 500) : 48}
      extraData={{
        viewing,
      }}
      getItemType={(item) => (type === 'post' ? (item as Post).type : type)}
      keyExtractor={(item) => item.id}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={() => {
        history.save(query)
      }}
      onViewableItemsChanged={({ viewableItems }) => {
        setViewing(() => viewableItems.map((item) => item.key))
      }}
      ref={list}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={renderItem}
      viewabilityConfig={{
        viewAreaCoveragePercentThreshold: 60,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: {
    paddingVertical: theme.space[2],
  },
  separator: (oled: boolean, compact: boolean) => ({
    backgroundColor: oled ? theme.colors.gray.border : undefined,
    height: oled ? 1 : theme.space[compact ? 2 : 4],
  }),
}))
