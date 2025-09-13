import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { TabView } from 'react-native-tab-view'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { IconButton } from '~/components/common/icon/button'
import { Loading } from '~/components/common/loading'
import { SearchBox } from '~/components/common/search'
import { SegmentedControl } from '~/components/common/segmented-control'
import { View } from '~/components/common/view'
import { Header } from '~/components/navigation/header'
import { PostList } from '~/components/posts/list'
import {
  SortIntervalMenu,
  type SortIntervalMenuData,
} from '~/components/posts/sort-interval'
import { ListFlags, useList } from '~/hooks/list'
import { heights, iPad } from '~/lib/common'
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
  const router = useRouter()
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
  const a11y = useTranslations('a11y')

  styles.useVariants({
    iPad,
    oled: themeOled,
    tint: themeTint,
  })

  const listProps = useList(ListFlags.ALL, {
    top: heights.notifications,
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
                <View direction="row" style={styles.header}>
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
              <View direction="row" style={styles.header}>
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
      renderTabBar={({ position }) => (
        <Header
          back
          right={
            <IconButton
              icon="info.circle"
              label={a11y('aboutCommunity', {
                community: params.name,
              })}
              onPress={() => {
                router.push({
                  params: {
                    name: params.name,
                  },
                  pathname: '/users/[name]/about',
                })
              }}
            />
          }
          title={params.name}
        >
          <View gap="4" pb="4" px="3">
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
  header: {
    backgroundColor: theme.colors.gray.bg,
    borderBottomColor: theme.colors.gray.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
}))
