import { LegendList, type LegendListRef } from '@legendapp/list'
import { useScrollToTop } from '@react-navigation/native'
import {
  type ReactElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { type ViewabilityConfigCallbackPairs } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { CommunityCard } from '~/components/communities/card'
import { PostCard } from '~/components/posts/card'
import { useHistory } from '~/hooks/history'
import { estimateHeight, type ListProps } from '~/hooks/list'
import { useSearch } from '~/hooks/queries/search/search'
import { useSearchHistory } from '~/hooks/search'
import { usePreferences } from '~/stores/preferences'
import { type Community } from '~/types/community'
import { type SearchTab } from '~/types/defaults'
import { type Post } from '~/types/post'
import { type SearchSort, type TopInterval } from '~/types/sort'
import { type SearchUser } from '~/types/user'

import { View } from '../common/view'
import { UserCard } from '../users/card'
import { SearchHistory } from './history'

type Props = {
  community?: string
  focused?: boolean
  header?: ReactElement
  interval?: TopInterval
  listProps?: ListProps
  onChangeQuery: (query: string) => void
  query: string
  sort?: SearchSort
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
  type,
}: Props) {
  const t = useTranslations('component.search.list')

  const list = useRef<LegendListRef>(null)

  useScrollToTop(list)

  const { styles } = useStyles(stylesheet)

  const { feedCompact, seenOnScroll, themeOled } = usePreferences()
  const { addPost } = useHistory()

  const history = useSearchHistory(community)

  const { isLoading, refetch, results } = useSearch({
    community,
    interval,
    query,
    sort,
    type,
  })

  const viewabilityConfigCallbackPairs =
    useMemo<ViewabilityConfigCallbackPairs>(
      () => [
        {
          onViewableItemsChanged({ viewableItems }) {
            setViewing(() => viewableItems.map((item) => item.key))
          },
          viewabilityConfig: {
            viewAreaCoveragePercentThreshold: 60,
          },
        },
        {
          onViewableItemsChanged({ viewableItems }) {
            if (!seenOnScroll) {
              return
            }

            if (type === 'post') {
              viewableItems.forEach((item) => {
                addPost({
                  id: (item.item as Post).id,
                })
              })
            }
          },
          viewabilityConfig: {
            viewAreaCoveragePercentThreshold: 60,
          },
        },
      ],
      [addPost, seenOnScroll, type],
    )

  const [viewing, setViewing] = useState<Array<string>>([])

  const renderItem = useCallback(
    (item: Community | SearchUser | Post, index: number) => {
      const style = [
        index === 0 && styles.first,
        index + 1 === results.length && styles.last,
      ]

      if (type === 'community') {
        return <CommunityCard community={item as Community} style={style} />
      }

      if (type === 'user') {
        return <UserCard style={style} user={item as SearchUser} />
      }

      return (
        <PostCard
          label="subreddit"
          post={item as Post}
          viewing={focused ? viewing.includes(item.id) : false}
        />
      )
    },
    [focused, results.length, styles.first, styles.last, type, viewing],
  )

  return (
    <LegendList
      {...listProps}
      ItemSeparatorComponent={() => (
        <View style={styles.separator(type, themeOled, feedCompact)} />
      )}
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
      data={results}
      extraData={{
        viewing,
      }}
      getEstimatedItemSize={(index, item) => {
        if (type === 'post') {
          return estimateHeight({
            compact: feedCompact,
            index,
            item: item as Post,
            type: 'post',
          })
        }

        return 56
      }}
      keyExtractor={(item) => item.id}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={() => {
        history.save(query)
      }}
      recycleItems={type !== 'post'}
      ref={list}
      refreshControl={
        <RefreshControl
          offset={listProps?.progressViewOffset}
          onRefresh={refetch}
        />
      }
      renderItem={({ index, item }) => renderItem(item, index)}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
    />
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  first: {
    marginTop: theme.space[2],
  },
  last: {
    marginBottom: theme.space[2],
  },
  separator: (type: SearchTab, oled: boolean, compact: boolean) => {
    if (type === 'post') {
      return {
        backgroundColor: oled ? theme.colors.gray.border : undefined,
        height: oled ? runtime.hairlineWidth : theme.space[compact ? 2 : 4],
      }
    }

    return {}
  },
}))
