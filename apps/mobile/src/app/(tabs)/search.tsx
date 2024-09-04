import { useIsFocused } from '@react-navigation/native'
import { useFocusEffect, useNavigation } from 'expo-router'
import { useRef, useState } from 'react'
import Pager from 'react-native-pager-view'
import { useSharedValue } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'

import {
  type SearchFilters,
  SearchPostFilters,
} from '~/components/search/filters'
import { SearchHeader } from '~/components/search/header'
import { SearchList } from '~/components/search/list'

export default function Screen() {
  const navigation = useNavigation()

  const focused = useIsFocused()

  const pager = useRef<Pager>(null)

  const { styles } = useStyles(stylesheet)

  const offset = useSharedValue(0)

  useFocusEffect(() => {
    navigation.setOptions({
      header: () => (
        <SearchHeader
          offset={offset}
          onChange={(next) => {
            pager.current?.setPage(next)
          }}
          onQueryChange={setQuery}
          query={query}
        />
      ),
    })
  })

  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    interval: 'all',
    sort: 'relevance',
  })

  const [debounced] = useDebounce(query, 500)

  return (
    <Pager
      onPageScroll={(event) => {
        offset.value = event.nativeEvent.offset + event.nativeEvent.position
      }}
      onPageSelected={(event) => {
        setPage(event.nativeEvent.position)
      }}
      ref={pager}
      style={styles.main}
    >
      <SearchList
        focused={focused ? page === 0 : false}
        header={
          <SearchPostFilters
            filters={filters}
            onChange={setFilters}
            style={styles.filters}
          />
        }
        key="posts"
        query={debounced}
        type="post"
      />

      <SearchList key="communities" query={debounced} type="community" />
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
}))
