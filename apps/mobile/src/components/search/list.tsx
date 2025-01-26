import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { type ReactElement, useRef, useState } from 'react'
import { type ViewabilityConfigCallbackPairs } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { CommunityCard } from '~/components/communities/card'
import { PostCard } from '~/components/posts/card'
import { useHistory } from '~/hooks/history'
import { type ListProps } from '~/hooks/list'
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

type Item = Community | SearchUser | Post

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
  const list = useRef<FlashList<Item>>(null)

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

  const viewabilityConfigCallbackPairs = useRef<ViewabilityConfigCallbackPairs>(
    [
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
  )

  const [viewing, setViewing] = useState<Array<string>>([])

  return (
    <FlashList
      {...listProps}
      ItemSeparatorComponent={() => (
        <View style={styles.separator(type, themeOled, feedCompact)} />
      )}
      ListEmptyComponent={
        isLoading ? (
          <Loading />
        ) : history.history.length > 0 ? (
          <SearchHistory history={history} onChange={onChangeQuery} />
        ) : (
          <Empty />
        )
      }
      ListHeaderComponent={header}
      data={results}
      estimatedItemSize={type === 'post' ? (feedCompact ? 112 : 120) : 56}
      extraData={{
        viewing,
      }}
      getItemType={() => type}
      keyExtractor={(item) => item.id}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={() => {
        history.save(query)
      }}
      ref={list}
      refreshControl={
        <RefreshControl
          offset={listProps?.progressViewOffset}
          onRefresh={refetch}
        />
      }
      renderItem={({ index, item }) => {
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
      }}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
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
