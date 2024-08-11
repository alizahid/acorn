import { FlashList } from '@shopify/flash-list'
import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
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

  const common = useCommon()

  const { styles } = useStyles(stylesheet)

  const [query] = useDebounce(params.query, 500)

  const { isLoading, results } = useSearch({
    query,
    type: params.type,
  })

  return (
    <FlashList
      {...common.listProps({
        search: true,
        tabBar: true,
      })}
      ItemSeparatorComponent={() => (
        <View style={styles.separator(params.type)} />
      )}
      ListEmptyComponent={isLoading ? <Loading /> : <Empty />}
      contentContainerStyle={styles.main(
        params.type,
        common.height.search,
        common.height.tabBar,
      )}
      data={results}
      estimatedItemSize={params.type === 'community' ? 56 : 120}
      getItemType={() => params.type}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => {
        if (params.type === 'community') {
          return <CommunityCard community={item as Community} />
        }

        return (
          <PostCard label="subreddit" post={item as Post} viewing={false} />
        )
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (type: SearchType, header: number, tabBar: number) => ({
    paddingBottom: tabBar + (type === 'community' ? theme.space[2] : 0),
    paddingTop: header + (type === 'community' ? theme.space[2] : 0),
  }),
  separator: (type: SearchType) => ({
    height: type === 'post' ? theme.space[5] : 0,
  }),
}))
