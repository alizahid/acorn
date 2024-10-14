import { useIsFocused } from '@react-navigation/native'
import { useState } from 'react'
import { Tabs } from 'react-native-collapsible-tab-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'use-intl'

import { SegmentedControl } from '~/components/common/segmented-control'
import { TextBox } from '~/components/common/text-box'
import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'
import {
  type SearchFilters,
  SearchPostFilters,
} from '~/components/search/filters'
import { SearchList } from '~/components/search/list'
import { SearchTab } from '~/types/search'

export function SearchScreen() {
  const focused = useIsFocused()

  const t = useTranslations('screen.search')

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
      headerHeight={56}
      lazy
      onIndexChange={setTab}
      renderHeader={() => (
        <View style={styles.tabs}>
          <TextBox
            onChangeText={setQuery}
            placeholder={t('title')}
            returnKeyType="search"
            right={
              query.length > 0 ? (
                <HeaderButton
                  color="gray"
                  icon="XCircle"
                  onPress={() => {
                    setQuery('')
                  }}
                  style={styles.clear}
                  weight="fill"
                />
              ) : null
            }
            styleContent={styles.query}
            value={query}
          />
        </View>
      )}
      renderTabBar={({ indexDecimal, onTabPress }) => (
        <View style={styles.tabs}>
          <SegmentedControl
            items={SearchTab.map((item) => t(`tabs.${item}`))}
            offset={indexDecimal}
            onChange={(index) => {
              const next = SearchTab[index]

              if (next) {
                onTabPress(next)
              }
            }}
          />
        </View>
      )}
      revealHeaderOnScroll
      tabBarHeight={52}
    >
      <Tabs.Tab name="post">
        <SearchList
          filters={filters}
          focused={focused ? tab === 0 : false}
          header={<SearchPostFilters filters={filters} onChange={setFilters} />}
          query={debounced}
          tabs
          type="post"
        />
      </Tabs.Tab>

      <Tabs.Tab name="community">
        <SearchList query={debounced} tabs type="community" />
      </Tabs.Tab>

      <Tabs.Tab name="user">
        <SearchList query={debounced} tabs type="user" />
      </Tabs.Tab>
    </Tabs.Container>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  clear: {
    height: theme.space[7],
    width: theme.space[7],
  },
  header: {
    backgroundColor: theme.colors.gray[1],
    shadowColor: 'transparent',
  },
  main: {
    flex: 1,
  },
  query: {
    backgroundColor: theme.colors.gray.a3,
    borderWidth: 0,
  },
  tabs: {
    backgroundColor: theme.colors.gray[1],
    paddingBottom: theme.space[4],
    paddingHorizontal: theme.space[3],
  },
}))
