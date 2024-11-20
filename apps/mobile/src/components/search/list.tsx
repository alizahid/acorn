import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { type ReactElement, useRef, useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { CommunityCard } from '~/components/communities/card'
import { PostCard } from '~/components/posts/card'
import { useHistory } from '~/hooks/history'
import { useSearch } from '~/hooks/queries/search/search'
import { useSearchHistory } from '~/hooks/search'
import { listProps } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type Community } from '~/types/community'
import { type Post } from '~/types/post'
import { type SearchTab } from '~/types/search'
import { type SearchSort, type TopInterval } from '~/types/sort'
import { type SearchUser } from '~/types/user'

import { Refreshing, type RefreshingProps } from '../common/refreshing'
import { View } from '../common/view'
import { SearchUserCard } from '../users/search'
import { SearchHistory } from './history'

type Props = {
  community?: string
  focused?: boolean
  header?: ReactElement
  interval?: TopInterval
  onChangeQuery: (query: string) => void
  query: string
  refreshing?: RefreshingProps
  sort?: SearchSort
  type: SearchTab
}

export function SearchList({
  community,
  focused,
  header,
  interval,
  onChangeQuery,
  query,
  refreshing,
  sort,
  type,
}: Props) {
  const list = useRef<FlashList<Community | SearchUser | Post>>(null)

  useScrollToTop(list)

  const { styles } = useStyles(stylesheet)

  const { feedCompact, seenOnScroll } = usePreferences()
  const { addPost } = useHistory()

  const history = useSearchHistory()

  const { isLoading, isRefreshing, refetch, results } = useSearch({
    community,
    interval,
    query,
    sort,
    type,
  })

  const [viewing, setViewing] = useState<Array<string>>([])

  return (
    <>
      <FlashList
        {...listProps}
        ItemSeparatorComponent={() => (
          <View style={styles.separator(type, feedCompact)} />
        )}
        ListEmptyComponent={
          isLoading ? (
            <Loading />
          ) : history.history.length > 0 ? (
            <SearchHistory
              history={history.history}
              onClear={history.clear}
              onPress={onChangeQuery}
            />
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
        refreshControl={<RefreshControl onRefresh={refetch} />}
        renderItem={({ item }) => {
          if (type === 'community') {
            return <CommunityCard community={item as Community} />
          }

          if (type === 'user') {
            return <SearchUserCard user={item as SearchUser} />
          }

          return (
            <PostCard
              label="subreddit"
              post={item as Post}
              viewing={focused ? viewing.includes(item.id) : false}
            />
          )
        }}
        viewabilityConfigCallbackPairs={[
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
              minimumViewTime: 3_000,
              viewAreaCoveragePercentThreshold: 60,
            },
          },
        ]}
      />

      {isRefreshing ? <Refreshing {...refreshing} /> : null}
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  separator: (type: SearchTab, compact: boolean) => {
    if (type === 'post') {
      return {
        height: theme.space[compact ? 2 : 4],
      }
    }

    return {}
  },
}))
