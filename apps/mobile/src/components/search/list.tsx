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
import { listProps } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type Community } from '~/types/community'
import { type Post } from '~/types/post'
import { type SearchTab } from '~/types/search'
import { type SearchSort, type TopInterval } from '~/types/sort'
import { type SearchUser } from '~/types/user'

import { Refreshing } from '../common/refreshing'
import { View } from '../common/view'
import { SearchUserCard } from '../users/search'

type Props = {
  community?: string
  focused?: boolean
  header?: ReactElement
  interval?: TopInterval
  query: string
  sort?: SearchSort
  type: SearchTab
}

export function SearchList({
  community,
  focused,
  header,
  interval,
  query,
  sort,
  type,
}: Props) {
  const list = useRef<FlashList<Community | SearchUser | Post>>(null)

  useScrollToTop(list)

  const { styles } = useStyles(stylesheet)

  const { feedCompact, mediaOnRight, seenOnScroll } = usePreferences()
  const { addPost } = useHistory()

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
        ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
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
              compact={feedCompact}
              label="subreddit"
              post={item as Post}
              reverse={mediaOnRight}
              viewing={focused ? viewing.includes(item.id) : false}
            />
          )
        }}
        scrollEnabled={results.length > 0}
        viewabilityConfigCallbackPairs={[
          {
            onViewableItemsChanged({ viewableItems }) {
              setViewing(() => viewableItems.map((item) => item.key))
            },
            viewabilityConfig: {
              itemVisiblePercentThreshold: 100,
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
              itemVisiblePercentThreshold: 100,
              minimumViewTime: 3_000,
            },
          },
        ]}
      />

      {isRefreshing ? <Refreshing /> : null}
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
