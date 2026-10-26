import { useCallback, useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-screens/experimental'
import {
  type NavigationState,
  type SceneRendererProps,
  TabView,
} from 'react-native-tab-view'
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
import { glass } from '~/lib/common'
import { useDefaults } from '~/stores/defaults'
import { usePreferences } from '~/stores/preferences'

const routes = useDefaults
  .getState()
  .searchTabs.filter(({ disabled }) => !disabled)
  .map(({ key }) => ({
    key,
    title: key,
  }))

type Route = (typeof routes)[number]

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

  const [sort, setSort] = useState(sortSearchPosts)
  const [interval, setInterval] = useState(intervalSearchPosts)

  const [index, setIndex] = useState(0)
  const [query, setQuery] = useState('')

  const [debounced] = useDebounce(query, 500)

  const listProps = useListProps(true)

  const props = {
    listProps,
    onChangeQuery: setQuery,
    query: debounced,
  } as const

  const renderScene = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: Route
    }) => {
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
    },
    [interval, props, sort],
  )

  const renderTabBar = useCallback(
    ({
      jumpTo,
      navigationState,
    }: SceneRendererProps & {
      navigationState: NavigationState<Route>
    }) => (
      <View style={styles.tabBar}>
        <SearchBox
          glass
          onChange={setQuery}
          placeholder="search"
          style={styles.search}
          value={query}
        />

        <SegmentedControl
          items={routes.map(({ key }) => ({
            label: t(`tabs.${key}`),
            value: key,
          }))}
          onChange={(next) => {
            jumpTo(next)
          }}
          value={navigationState.routes[navigationState.index]?.key}
        />
      </View>
    ),
    [query, t],
  )

  return (
    <SafeAreaView
      edges={{
        top: true,
      }}
    >
      <TabView
        lazy
        navigationState={{
          index,
          routes,
        }}
        onIndexChange={setIndex}
        renderLazyPlaceholder={() => <Loading />}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
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
  tabBar: {
    gap: theme.space[4],
    marginBottom: theme.space[4],
    marginHorizontal: theme.space[4],
    marginTop: Math.max(0, theme.space[4] - runtime.insets.top),
  },
}))
