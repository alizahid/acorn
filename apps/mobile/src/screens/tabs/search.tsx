import { useIsFocused } from '@react-navigation/native'
import { useRef, useState } from 'react'
import { TabView } from 'react-native-tab-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'use-intl'

import { Loading } from '~/components/common/loading'
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

  const routes = useRef(
    SearchTab.map((key) => ({
      key,
      title: t(`tabs.${key}`),
    })),
  )

  const [index, setIndex] = useState(0)
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    interval: 'all',
    sort: 'relevance',
  })

  const [debounced] = useDebounce(query, 500)

  return (
    <TabView
      lazy
      navigationState={{
        index,
        routes: routes.current,
      }}
      onIndexChange={setIndex}
      renderLazyPlaceholder={Loading}
      renderScene={({ route }) => {
        if (route.key === 'post') {
          return (
            <SearchList
              filters={filters}
              focused={focused ? index === 0 : false}
              header={
                <SearchPostFilters filters={filters} onChange={setFilters} />
              }
              query={debounced}
              type="post"
            />
          )
        }

        if (route.key === 'community') {
          return <SearchList query={debounced} type="community" />
        }

        return <SearchList query={debounced} type="user" />
      }}
      renderTabBar={({ position }) => {
        return (
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

            <SegmentedControl
              items={routes.current.map(({ title }) => title)}
              offset={position}
              onChange={(next) => {
                setIndex(next)
              }}
            />
          </View>
        )
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  clear: {
    height: theme.space[7],
    width: theme.space[7],
  },
  query: {
    backgroundColor: theme.colors.gray.a3,
    borderWidth: 0,
  },
  tabs: {
    backgroundColor: theme.colors.gray[1],
    gap: theme.space[4],
    paddingBottom: theme.space[4],
    paddingHorizontal: theme.space[3],
  },
}))
