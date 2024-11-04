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
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { SearchList } from '~/components/search/list'
import { usePreferences } from '~/stores/preferences'
import { SearchTab } from '~/types/search'
import { type SearchSort } from '~/types/sort'

export function SearchScreen() {
  const focused = useIsFocused()

  const t = useTranslations('screen.search')

  const { intervalSearchPosts, sortSearchPosts } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const routes = useRef(
    SearchTab.map((key) => ({
      key,
      title: t(`tabs.${key}`),
    })),
  )

  const [sort, setSort] = useState(sortSearchPosts)
  const [interval, setInterval] = useState(intervalSearchPosts)

  const [index, setIndex] = useState(0)
  const [query, setQuery] = useState('')

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
              focused={focused ? index === 0 : false}
              header={
                <SortIntervalMenu
                  interval={interval}
                  onChange={(next) => {
                    setSort(next.sort as SearchSort)

                    if (next.interval) {
                      setInterval(next.interval)
                    }
                  }}
                  sort={sort}
                  type="search"
                />
              }
              interval={interval}
              query={debounced}
              sort={sort}
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
