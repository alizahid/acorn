import { useHeaderHeight } from '@react-navigation/elements'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { TabView } from 'react-native-tab-view'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Loading } from '~/components/common/loading'
import { SearchBox } from '~/components/common/search'
import { SegmentedControl } from '~/components/common/segmented-control'
import { PostList } from '~/components/posts/list'
import {
  SortIntervalMenu,
  type SortIntervalMenuData,
} from '~/components/posts/sort-interval'
import { iOS26, iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { UserTab } from '~/types/user'

const schema = z.object({
  name: z.string().catch('mildpanda'),
})

export type UserParams = z.infer<typeof schema>

const routes = UserTab.map((key) => ({
  key,
  title: key,
}))

export default function Screen() {
  const headerHeight = useHeaderHeight()

  const params = schema.parse(useLocalSearchParams())

  const {
    intervalUserComments,
    intervalUserPosts,
    sortUserComments,
    sortUserPosts,
    themeOled,
    themeTint,
  } = usePreferences()

  const t = useTranslations('screen.users.user')

  styles.useVariants({
    iPad,
    oled: themeOled,
    tint: themeTint,
  })

  const [index, setIndex] = useState(0)
  const [query, setQuery] = useState('')

  const [posts, setPosts] = useState<SortIntervalMenuData<'user'>>({
    interval: intervalUserPosts,
    sort: sortUserPosts,
  })
  const [comments, setComments] = useState<SortIntervalMenuData<'comment'>>({
    interval: intervalUserComments,
    sort: sortUserComments,
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
        if (route.key === 'posts') {
          return (
            <PostList
              header={
                <View style={styles.header}>
                  <SearchBox onChange={setQuery} value={query} />

                  <SortIntervalMenu
                    interval={posts.interval}
                    onChange={(next) => {
                      setPosts(next)
                    }}
                    sort={posts.sort}
                    type="user"
                  />
                </View>
              }
              interval={posts.interval}
              query={query}
              sort={posts.sort}
              style={styles.list}
              user={params.name}
              userType="submitted"
            />
          )
        }

        return (
          <PostList
            header={
              <View style={styles.header}>
                <SearchBox onChange={setQuery} value={query} />

                <SortIntervalMenu
                  interval={comments.interval}
                  onChange={(next) => {
                    setComments(next)
                  }}
                  sort={comments.sort}
                  type="comment"
                />
              </View>
            }
            interval={comments.interval}
            query={query}
            sort={comments.sort}
            style={styles.list}
            user={params.name}
            userType="comments"
          />
        )
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
      style={styles.main(headerHeight)}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    backgroundColor: theme.colors.gray.bg,
    borderBottomColor: theme.colors.gray.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    variants: {
      iPad: {
        true: {
          marginBottom: theme.space[4],
          marginHorizontal: -theme.space[4],
          marginTop: -theme.space[4],
        },
      },
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bgAlpha,
        },
      },
      tint: {
        true: {
          backgroundColor: theme.colors.accent.bg,
        },
      },
    },
  },
  list: {
    variants: {
      iPad: {
        true: {
          padding: theme.space[4],
        },
      },
    },
  },
  main: (headerHeight) => ({
    marginTop: iOS26 ? headerHeight : undefined,
  }),
  tabBar: {
    marginBottom: theme.space[2],
    marginHorizontal: theme.space[2],
    marginTop: iOS26 ? undefined : theme.space[2],
  },
}))
