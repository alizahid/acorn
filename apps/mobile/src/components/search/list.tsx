import {
  FlashList,
  type FlashListRef,
  type ListRenderItem,
} from '@shopify/flash-list'
import { type ReactElement, useCallback, useRef, useState } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
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
import { useStickyNav } from '~/hooks/sticky-nav'
import { cardMaxWidth, iPad } from '~/lib/common'
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

  const list = useRef<FlashListRef<Item>>(null)

  useScrollToTop(list, listProps)

  const { feedCompact, themeOled } = usePreferences()

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

  const [viewing, setViewing] = useState<Array<string>>([])
  const [visible, setVisible] = useState<Array<string>>([])

  const sticky = useStickyNav()

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
          visible={focused ? visible.includes(item.id) : false}
        />
      )
    },
    [focused, type, viewing, visible],
  )

  return (
    <FlashList
      {...listProps}
      {...sticky}
      contentContainerStyle={StyleSheet.flatten([
        type !== 'post' && styles.content,
        style,
      ])}
      data={results}
      extraData={{
        viewing,
      }}
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
          <Empty icon="SmileySad" message={t('notFound')} />
        ) : history.history.length > 0 ? (
          <SearchHistory history={history} onChange={onChangeQuery} />
        ) : (
          <Empty icon="MagnifyingGlass" message={t('empty')} weight="duotone" />
        )
      }
      ListHeaderComponent={header}
      maintainVisibleContentPosition={{
        disabled: true,
      }}
      onScrollBeginDrag={() => {
        history.save(query)
      }}
      ref={list}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={renderItem}
      viewabilityConfigCallbackPairs={[
        {
          onViewableItemsChanged({ viewableItems }) {
            setVisible(() => viewableItems.map((item) => item.key))
          },
          viewabilityConfig: {
            itemVisiblePercentThreshold: 10,
            minimumViewTime: 0,
            waitForInteraction: false,
          },
        },
        {
          onViewableItemsChanged({ viewableItems }) {
            setViewing(() => viewableItems.map((item) => item.key))
          },
          viewabilityConfig: {
            minimumViewTime: 0,
            viewAreaCoveragePercentThreshold: 60,
            waitForInteraction: false,
          },
        },
      ]}
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
