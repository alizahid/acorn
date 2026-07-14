import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { TabView } from 'react-native-tab-view'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'
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
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { space } from '~/styles/tokens'
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
  const params = schema.parse(useLocalSearchParams())

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

  const t = useTranslations('screen.users.user')

  styles.useVariants({
    iPad,
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

  const { contentContainerStyle } = useListProps({})
  const listProps = useListProps({
    extraBottom: space[4],
    header: false,
    top: false,
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
              listProps={listProps}
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
            listProps={listProps}
            query={query}
            sort={comments.sort}
            style={styles.list}
            user={params.name}
            userType="comments"
          />
        )
      }}
      renderTabBar={({ jumpTo, navigationState }) => (
        <View style={styles.tabBar(contentContainerStyle.paddingTop)}>
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
  header: {
    borderBottomColor: theme.colors.gray.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    variants: {
      iPad: {
        true: {
          marginBottom: theme.space[4],
          marginHorizontal: -theme.space[4],
        },
      },
    },
  },
  list: {
    variants: {
      iPad: {
        true: {
          paddingHorizontal: theme.space[4],
        },
      },
    },
  },
  tabBar: (marginTop: number) => ({
    margin: theme.space[4],
    marginTop: marginTop + theme.space[4],
  }),
}))
