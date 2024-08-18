import { useIsFocused } from '@react-navigation/native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import Pager from 'react-native-pager-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import { View } from '~/components/common/view'
import {
  type SearchFilters,
  SearchPostFilters,
} from '~/components/search/filters'
import { SearchList } from '~/components/search/list'
import { useCommon } from '~/hooks/common'
import { SearchType } from '~/types/search'

const schema = z.object({
  query: z.string().catch(''),
  type: z.enum(SearchType).catch('post'),
})

export default function Screen() {
  const router = useRouter()

  const focused = useIsFocused()

  const params = schema.parse(useLocalSearchParams())

  const common = useCommon()

  const { styles } = useStyles(stylesheet)

  const pager = useRef<Pager>(null)

  const [filters, setFilters] = useState<SearchFilters>({
    interval: 'all',
    sort: 'relevance',
  })

  const [query] = useDebounce(params.query, 500)

  const type = params.type

  useEffect(() => {
    const index = SearchType.indexOf(type)

    pager.current?.setPage(index)
  }, [type])

  return (
    <Pager
      initialPage={0}
      onPageSelected={(event) => {
        router.setParams({
          type: SearchType[event.nativeEvent.position],
        })
      }}
      ref={pager}
      style={styles.main}
    >
      <View flexGrow={1} key="posts" style={styles.posts(common.height.search)}>
        <SearchPostFilters
          filters={filters}
          onChange={setFilters}
          style={styles.filters}
        />

        <SearchList
          focused={focused ? type === 'post' : false}
          insets={['bottom', 'tabBar']}
          query={query}
          type="post"
        />
      </View>

      <SearchList
        focused={focused ? type === 'community' : false}
        insets={['top', 'bottom', 'search', 'tabBar']}
        key="communities"
        query={query}
        type="community"
      />
    </Pager>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  filters: {
    paddingHorizontal: theme.space[2],
  },
  main: {
    flex: 1,
  },
  posts: (top: number) => ({
    paddingTop: top,
  }),
}))
