import { useIsFocused } from '@react-navigation/native'
import { useNavigation } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { type TextInput } from 'react-native'
import { TabView } from 'react-native-tab-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'use-intl'

import { Loading } from '~/components/common/loading'
import { SegmentedControl } from '~/components/common/segmented-control'
import { TextBox } from '~/components/common/text-box'
import { View } from '~/components/common/view'
import { Header } from '~/components/navigation/header'
import { HeaderButton } from '~/components/navigation/header-button'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { SearchList } from '~/components/search/list'
import { useList } from '~/hooks/list'
import { useDefaults } from '~/stores/defaults'
import { usePreferences } from '~/stores/preferences'

export default function Screen() {
  const navigation = useNavigation()
  const focused = useIsFocused()

  const t = useTranslations('screen.search')

  const { intervalSearchPosts, sortSearchPosts } = usePreferences()
  const { searchTabs } = useDefaults()

  const { styles, theme } = useStyles(stylesheet)

  const routes = useRef(
    searchTabs.map((key) => ({
      key,
      title: t(`tabs.${key}`),
    })),
  )

  const listProps = useList({
    top: theme.space[7] + theme.space[4] + theme.space[7] + theme.space[4],
  })

  const search = useRef<TextInput>(null)

  const [sort, setSort] = useState(sortSearchPosts)
  const [interval, setInterval] = useState(intervalSearchPosts)

  const [index, setIndex] = useState(0)
  const [query, setQuery] = useState('')

  const [debounced] = useDebounce(query, 500)

  useEffect(() => {
    const tabs = navigation.getParent()

    const unsubscribe = tabs?.addListener(
      'tabPress' as unknown as 'focus',
      () => {
        search.current?.focus()
      },
    )

    return () => {
      unsubscribe?.()
    }
  }, [navigation])

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
        routes: routes.current,
      }}
      onIndexChange={setIndex}
      renderLazyPlaceholder={Loading}
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
              onChangeText={setQuery}
              placeholder={t('title')}
              ref={search}
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
        </Header>
      )}
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
}))