import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { type ReactElement, useRef, useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { CommunityCard } from '~/components/communities/card'
import { PostCard } from '~/components/posts/card'
import { useSearch } from '~/hooks/queries/search/search'
import { listProps } from '~/lib/common'
import { useHistory } from '~/stores/history'
import { type Community } from '~/types/community'
import { type Post } from '~/types/post'
import { type SearchTab } from '~/types/search'
import { type SearchUser } from '~/types/user'

import { View } from '../common/view'
import { SearchUserCard } from '../users/search'
import { type SearchFilters } from './filters'

type Props = {
  community?: string
  filters?: SearchFilters
  focused?: boolean
  header?: ReactElement
  query: string
  type: SearchTab
}

export function SearchList({
  community,
  filters,
  focused,
  header,
  query,
  type,
}: Props) {
  const list = useRef<FlashList<Community | SearchUser | Post>>(null)

  useScrollToTop(list)

  const { styles } = useStyles(stylesheet)

  const { addPost } = useHistory()

  const { isLoading, refetch, results } = useSearch({
    community,
    interval: filters?.interval,
    query,
    sort: filters?.sort,
    type,
  })

  const [viewing, setViewing] = useState<Array<string>>([])

  return (
    <FlashList
      {...listProps}
      ItemSeparatorComponent={() => <View style={styles.separator(type)} />}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListHeaderComponent={header}
      data={results}
      estimatedItemSize={type === 'post' ? 120 : 56}
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
            label="subreddit"
            post={item as Post}
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
            if (type === 'post') {
              viewableItems.forEach((item) => {
                addPost((item.item as Post).id)
              })
            }
          },
          viewabilityConfig: {
            itemVisiblePercentThreshold: 100,
            minimumViewTime: 1_500,
          },
        },
      ]}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  separator: (type: SearchTab) => {
    if (type === 'post') {
      return {
        height: theme.space[4],
      }
    }

    return {}
  },
}))
