import { Stack } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'
import { type SearchBarCommands } from 'react-native-screens'
import { TabView } from 'react-native-tab-view'
import { StyleSheet } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'use-intl'

import { Loading } from '~/components/common/loading'
import { SegmentedControl } from '~/components/common/segmented-control'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { SearchList } from '~/components/search/list'
import { useTabPress } from '~/hooks/tabs'
import { iPad } from '~/lib/common'
import { useShallow } from 'zustand/react/shallow'

import { useDefaults } from '~/stores/defaults'
import { usePreferences } from '~/stores/preferences'

const routes = useDefaults
  .getState()
  .searchTabs.filter(({ disabled }) => !disabled)
  .map(({ key }) => ({
    key,
    title: key,
  }))

export default function Screen() {
  const t = useTranslations('screen.search')

  const { intervalSearchPosts, sortSearchPosts } = usePreferences(
    useShallow((s) => ({
      intervalSearchPosts: s.intervalSearchPosts,
      sortSearchPosts: s.sortSearchPosts,
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

  const props = {
    onChangeQuery,
    query: debounced,
  } as const

  return (
    <>
      <Stack.SearchBar
        onChangeText={(event) => {
          setQuery(event.nativeEvent.text)
        }}
        placeholder={t('title')}
        placement="stacked"
        ref={search}
      />

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
          <View style={styles.tabBar}>
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
    </>
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
  tabBar: {
    paddingBottom: theme.space[4],
    paddingHorizontal: 20,
    paddingTop: iPad ? undefined : theme.space[4],
  },
}))
