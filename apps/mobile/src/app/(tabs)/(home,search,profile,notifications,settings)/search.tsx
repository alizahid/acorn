import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'
import { type SearchBarCommands } from 'react-native-screens'
import { TabView } from 'react-native-tab-view'
import { StyleSheet } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { Loading } from '~/components/common/loading'
import { SearchBox } from '~/components/common/search'
import { SegmentedControl } from '~/components/common/segmented-control'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { SearchList } from '~/components/search/list'
import { useListProps } from '~/hooks/list'
import { useTabPress } from '~/hooks/tabs'
import { glass } from '~/lib/common'
import { useDefaults } from '~/stores/defaults'
import { usePreferences } from '~/stores/preferences'
import { space } from '~/styles/tokens'

const routes = useDefaults
  .getState()
  .searchTabs.filter(({ disabled }) => !disabled)
  .map(({ key }) => ({
    key,
    title: key,
  }))

export default function Screen() {
  const t = useTranslations('screen.search')

  styles.useVariants({
    glass,
  })

  const { intervalSearchPosts, sortSearchPosts } = usePreferences(
    useShallow((state) => ({
      intervalSearchPosts: state.intervalSearchPosts,
      sortSearchPosts: state.sortSearchPosts,
    })),
  )

  const search = useRef<SearchBarCommands>(null)

  const [sort, setSort] = useState(sortSearchPosts)
  const [interval, setInterval] = useState(intervalSearchPosts)

  const [index, setIndex] = useState(0)
  const [query, setQuery] = useState('')

  const [debounced] = useDebounce(query, 500)

  useTabPress('tabPress', () => {
    search.current?.focus()
  })

  const onChangeQuery = useCallback((next: string) => {
    search.current?.setText(next)

    setQuery(next)
  }, [])

  const listProps = useListProps({
    extraBottom: space[4],
    header: false,
    top: false,
  })

  const props = {
    listProps,
    onChangeQuery,
    query: debounced,
  } as const

  const { contentContainerStyle } = useListProps({
    header: false,
  })

  return (
    <TabView
      lazy
      navigationState={{
        index,
        routes,
      }}
      onIndexChange={setIndex}
      renderLazyPlaceholder={() => <Loading />}
      renderScene={({ route }) => {
        if (route.key === 'post') {
          return (
            <SearchList
              {...props}
              header={
                <SortIntervalMenu
                  interval={interval}
                  onChange={(next) => {
                    setSort(next.sort)

                    if (next.interval) {
                      setInterval(next.interval)
                    }
                  }}
                  sort={sort}
                  type="search"
                />
              }
              interval={interval}
              sort={sort}
              type="post"
            />
          )
        }

        if (route.key === 'community') {
          return <SearchList {...props} type="community" />
        }

        return <SearchList {...props} type="user" />
      }}
      renderTabBar={({ jumpTo, navigationState }) => (
        <View style={styles.tabBar(contentContainerStyle.paddingTop)}>
          <SearchBox
            glass
            onChange={setQuery}
            placeholder="search"
            style={styles.search}
            value={query}
          />

          <SegmentedControl
            items={routes.map(({ key }) => ({
              key,
              label: t(`tabs.${key}`),
            }))}
            onChange={(next) => {
              jumpTo(next)
            }}
            value={navigationState.routes[navigationState.index]?.key}
          />
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  clear: {
    height: theme.space[7],
    width: theme.space[7],
  },
  query: {
    backgroundColor: theme.colors.gray.uiActiveAlpha,
    borderWidth: 0,
  },
  search: {
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    variants: {
      glass: {
        false: {
          backgroundColor: theme.colors.gray.ui,
        },
      },
    },
  },
  tabBar: (marginTop: number) => ({
    gap: theme.space[4],
    margin: theme.space[4],
    marginTop: marginTop + theme.space[4],
  }),
}))
