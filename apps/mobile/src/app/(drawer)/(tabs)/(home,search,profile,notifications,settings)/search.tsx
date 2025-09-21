import { useCallback, useRef, useState } from 'react'
import { type TextInput } from 'react-native'
import { TabView } from 'react-native-tab-view'
import { StyleSheet } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'use-intl'

import { IconButton } from '~/components/common/icon/button'
import { Loading } from '~/components/common/loading'
import { SegmentedControl } from '~/components/common/segmented-control'
import { TextBox } from '~/components/common/text-box'
import { View } from '~/components/common/view'
import { Header } from '~/components/navigation/header'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { SearchList } from '~/components/search/list'
import { useFocused } from '~/hooks/focus'
import { ListFlags, useList } from '~/hooks/list'
import { useTabPress } from '~/hooks/tabs'
import { heights } from '~/lib/common'
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
  const a11y = useTranslations('a11y')

  const { intervalSearchPosts, sortSearchPosts } = usePreferences()

  const { focused } = useFocused()

  const listProps = useList(ListFlags.ALL, {
    top: heights.search,
  })

  const search = useRef<TextInput>(null)

  const [sort, setSort] = useState(sortSearchPosts)
  const [interval, setInterval] = useState(intervalSearchPosts)

  const [index, setIndex] = useState(0)
  const [query, setQuery] = useState('')

  const [debounced] = useDebounce(query, 500)

  useTabPress('tabPress', () => {
    search.current?.focus()
  })

  const onChangeQuery = useCallback((next: string) => {
    setQuery(next)
  }, [])

  const props = {
    listProps,
    onChangeQuery,
    query: debounced,
  } as const

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
              focused={focused ? index === 0 : false}
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
      renderTabBar={({ position }) => (
        <Header title={t('title')}>
          <View gap="4" pb="4" px="3">
            <TextBox
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              onChangeText={setQuery}
              placeholder={t('title')}
              ref={search}
              returnKeyType="search"
              right={
                query.length > 0 ? (
                  <IconButton
                    color="gray"
                    icon="xmark.circle.fill"
                    label={a11y('clearQuery')}
                    onPress={() => {
                      setQuery('')
                    }}
                    style={styles.clear}
                  />
                ) : null
              }
              style={styles.query}
              value={query}
            />

            <SegmentedControl
              items={routes.map(({ key }) => t(`tabs.${key}`))}
              offset={position}
              onChange={(next) => {
                setIndex(next)
              }}
            />
          </View>
        </Header>
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
}))
