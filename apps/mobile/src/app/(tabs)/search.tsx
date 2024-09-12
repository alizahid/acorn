import { useIsFocused } from '@react-navigation/native'
import { useState } from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'

import {
  type SearchFilters,
  SearchPostFilters,
} from '~/components/search/filters'
import { SearchHeader } from '~/components/search/header'
import { SearchList } from '~/components/search/list'
import { SearchTabBar } from '~/components/search/tab-bar'

export default function Screen() {
  const focused = useIsFocused()

  const { styles } = useStyles(stylesheet)

  const [tab, setTab] = useState(0)
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    interval: 'all',
    sort: 'relevance',
  })

  const [debounced] = useDebounce(query, 500)

  return (
    <Tabs.Container
      headerContainerStyle={styles.header}
      lazy
      onIndexChange={setTab}
      renderHeader={() => <SearchHeader onChange={setQuery} query={query} />}
      renderTabBar={({ indexDecimal, onTabPress }) => (
        <SearchTabBar offset={indexDecimal} onPress={onTabPress} />
      )}
      revealHeaderOnScroll
    >
      <Tabs.Tab name="posts">
        <SearchList
          filters={filters}
          focused={focused ? tab === 0 : false}
          header={
            <SearchPostFilters
              filters={filters}
              onChange={setFilters}
              style={styles.filters}
            />
          }
          query={debounced}
          tabs
          type="post"
        />
      </Tabs.Tab>

      <Tabs.Tab name="communities">
        <SearchList query={debounced} tabs type="community" />
      </Tabs.Tab>
    </Tabs.Container>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  filters: {
    paddingHorizontal: theme.space[2],
  },
  header: {
    shadowColor: 'transparent',
  },
  main: {
    flex: 1,
  },
}))
