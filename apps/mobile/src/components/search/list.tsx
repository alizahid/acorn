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
import { type Community } from '~/types/community'
import { type Post } from '~/types/post'
import { type SearchTab } from '~/types/search'

import { View } from '../common/view'
import { type SearchFilters } from './filters'

type Props = {
  community?: string
  filters?: SearchFilters
  focused?: boolean
  header?: ReactElement
  inset?: boolean
  query: string
  type: SearchTab
}

export function SearchList({
  community,
  filters,
  focused,
  header,
  inset,
  query,
  type,
}: Props) {
  const list = useRef<FlashList<Community | Post>>(null)

  // @ts-expect-error -- go away
  useScrollToTop(list)

  const { styles } = useStyles(stylesheet)

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
      contentContainerStyle={styles.content(inset)}
      data={results}
      estimatedItemSize={type === 'community' ? 56 : 120}
      getItemType={() => type}
      keyboardDismissMode="on-drag"
      onViewableItemsChanged={({ viewableItems }) => {
        setViewing(() => viewableItems.map((item) => item.key))
      }}
      ref={list}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ item }) => {
        if (type === 'community') {
          return <CommunityCard community={item as Community} />
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
        waitForInteraction: false,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  content: (inset?: boolean) => ({
    paddingBottom: inset ? runtime.insets.bottom : undefined,
  }),
  separator: (type: SearchTab) => {
    if (type === 'community') {
      return {}
    }

    return {
      height: theme.space[2],
    }
  },
}))
