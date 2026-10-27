import { Stack } from 'expo-router'
import { useCallback, useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-screens/experimental'
import {
  type NavigationState,
  type SceneRendererProps,
  TabView,
} from 'react-native-tab-view'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { Loading } from '~/components/common/loading'
import { SearchBox } from '~/components/common/search'
import { SegmentedControl } from '~/components/common/segmented-control'
import { PostList } from '~/components/posts/list'
import {
  SortIntervalMenu,
  type SortIntervalMenuData,
} from '~/components/posts/sort-interval'
import { useListProps } from '~/hooks/list'
import { usePreferences } from '~/stores/preferences'

const routes = [
  {
    key: 'posts' as const,
    title: 'posts',
  },
  {
    key: 'comments' as const,
    title: 'comments',
  },
]

type Route = (typeof routes)[number]

type Props = {
  name: string
}

export function UserSavedList({ name }: Props) {
  const t = useTranslations('component.users.saved')

  const {
    intervalUserComments,
    intervalUserPosts,
    sortUserComments,
    sortUserPosts,
  } = usePreferences(
    useShallow((state) => ({
      intervalUserComments: state.intervalUserComments,
      intervalUserPosts: state.intervalUserPosts,
      sortUserComments: state.sortUserComments,
      sortUserPosts: state.sortUserPosts,
    })),
  )

  const [index, setIndex] = useState(0)
  const [query, setQuery] = useState('')

  const [posts, setPosts] = useState<SortIntervalMenuData<'user'>>({
    interval: intervalUserPosts,
    sort: sortUserPosts,
  })
  const [comments, setComments] = useState<SortIntervalMenuData<'user'>>({
    interval: intervalUserComments,
    sort: sortUserComments,
  })

  const listProps = useListProps(true)

  const props = {
    hideUser: true,
    listProps,
    query,
    user: name,
  } as const

  const renderScene = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: Route
    }) => {
      if (route.key === 'posts') {
        return (
          <PostList
            {...props}
            header={
              <SearchBox
                onChange={setQuery}
                style={styles.header}
                value={query}
              />
            }
            interval={posts.interval}
            sort={posts.sort}
            userType="savedPosts"
          />
        )
      }

      return (
        <PostList
          {...props}
          header={
            <SearchBox
              onChange={setQuery}
              style={styles.header}
              value={query}
            />
          }
          interval={comments.interval}
          sort={comments.sort}
          userType="savedComments"
        />
      )
    },
    [
      comments.interval,
      comments.sort,
      posts.interval,
      posts.sort,
      query,
      props,
    ],
  )

  const renderTabBar = useCallback(
    ({
      jumpTo,
      navigationState,
    }: SceneRendererProps & {
      navigationState: NavigationState<Route>
    }) => (
      <View style={styles.tabBar}>
        <SegmentedControl
          items={routes.map(({ key }) => ({
            label: t(key),
            value: key,
          }))}
          onChange={(next) => {
            jumpTo(next)
          }}
          value={navigationState.routes[navigationState.index]?.key}
        />
      </View>
    ),
    [t],
  )

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.View>
          {index === 0 ? (
            <SortIntervalMenu
              interval={posts.interval}
              onChange={(next) => {
                setPosts(next)
              }}
              sort={posts.sort}
              type="user"
            />
          ) : (
            <SortIntervalMenu
              interval={comments.interval}
              onChange={(next) => {
                setComments(next)
              }}
              sort={comments.sort}
              type="user"
            />
          )}
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      <SafeAreaView
        edges={{
          top: true,
        }}
      >
        <TabView
          keyboardDismissMode="on-drag"
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
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    borderBottomColor: theme.colors.gray.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tabBar: {
    padding: theme.space[4],
  },
}))
