import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { type ReactElement, useRef, useState } from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { CommunityCard } from '~/components/communities/card'
import { PostCard } from '~/components/posts/card'
import { useSearch } from '~/hooks/queries/search/search'
import { listProps } from '~/lib/common'
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
  tabs?: boolean
  type: SearchTab
}

export function SearchList({
  community,
  filters,
  focused,
  header,
  query,
  tabs,
  type,
}: Props) {
  const list = useRef<FlashList<Community | SearchUser | Post>>(null)

  useScrollToTop(
    useRef({
      scrollToTop() {
        list.current?.scrollToOffset({
          animated: true,
          offset: tabs ? -60 : 0,
        })
      },
    }),
  )

  const { styles } = useStyles(stylesheet)

  const { isLoading, refetch, results } = useSearch({
    community,
    interval: filters?.interval,
    query,
    sort: filters?.sort,
    type,
  })

  const [viewing, setViewing] = useState<Array<string>>([])

  const List = tabs ? Tabs.FlashList : FlashList

  return (
    <List
      {...listProps}
      ItemSeparatorComponent={() => <View style={styles.separator(type)} />}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      ListHeaderComponent={header}
      data={results}
      estimatedItemSize={type === 'community' ? 56 : 120}
      extraData={{
        viewing,
      }}
      getItemType={() => type}
      keyExtractor={(item) => item.id}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      onViewableItemsChanged={({ viewableItems }) => {
        setViewing(() => viewableItems.map((item) => item.key))
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
      viewabilityConfig={{
        itemVisiblePercentThreshold: 100,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  separator: (type: SearchTab) => {
    if (type === 'community') {
      return {}
    }

    return {
      height: theme.space[2],
    }
  },
}))
