import { useIsFocused, useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { CommunityCard } from '~/components/communities/card'
import { PostCard } from '~/components/posts/card'
import { useCommon } from '~/hooks/common'
import { useSearch } from '~/hooks/queries/search/search'
import { type Community } from '~/types/community'
import { type Post } from '~/types/post'
import { SearchType } from '~/types/search'

const schema = z.object({
  query: z.string().catch(''),
  type: z.enum(SearchType).catch('post'),
})

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const list = useRef<FlashList<Community | Post>>(null)

  const common = useCommon()
  const focused = useIsFocused()

  // @ts-expect-error -- go away
  useScrollToTop(list)

  const { styles, theme } = useStyles(stylesheet)

  const [query] = useDebounce(params.query, 500)

  const { isLoading, refetch, results } = useSearch({
    query,
    type: params.type,
  })

  useEffect(() => {
    list.current?.scrollToOffset({
      animated: true,
      offset: 0,
    })
  }, [params.type])

  const [viewing, setViewing] = useState<Array<string>>([])

  const props = common.listProps(
    ['top', 'bottom', 'search', 'tabBar'],
    [
      params.type === 'community' ? theme.space[2] : 0,
      params.type === 'community' ? theme.space[2] : 0,
    ],
  )

  return (
    <FlashList
      {...props}
      ItemSeparatorComponent={() => (
        <View style={styles.separator(params.type)} />
      )}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      data={results}
      drawDistance={common.frame.height}
      estimatedItemSize={params.type === 'community' ? 56 : 120}
      getItemType={() => params.type}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      onViewableItemsChanged={({ viewableItems }) => {
        setViewing(() => viewableItems.map((item) => item.key))
      }}
      ref={list}
      refreshControl={
        <RefreshControl offset={props.progressViewOffset} onRefresh={refetch} />
      }
      renderItem={({ item }) => {
        if (params.type === 'community') {
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

const stylesheet = createStyleSheet((theme) => ({
  separator: (type: SearchType) => {
    if (type === 'community') {
      return {}
    }

    return {
      backgroundColor: theme.colors.gray.a6,
      height: 1,
    }
  },
}))
