import { useFocusEffect, useNavigation } from 'expo-router'
import { useState } from 'react'
import { Drawer } from 'react-native-drawer-layout'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HomeDrawer } from '~/components/home/drawer'
import { FeedTypeMenu, type FeedTypeOptions } from '~/components/home/type-menu'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { usePreferences } from '~/stores/preferences'
import { type FeedSort } from '~/types/sort'

export function HomeScreen() {
  const navigation = useNavigation()

  const { feedType, intervalFeedPosts, sortFeedPosts } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const [open, setOpen] = useState(false)
  const [data, setData] = useState<FeedTypeOptions>({
    type: feedType,
  })
  const [sort, setSort] = useState(sortFeedPosts)
  const [interval, setInterval] = useState(intervalFeedPosts)

  useFocusEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <FeedTypeMenu
          community={data.community}
          feed={data.feed}
          onPress={() => {
            setOpen(true)
          }}
          type={data.type}
          user={data.user}
        />
      ),
      headerRight: () =>
        !data.user ? (
          <SortIntervalMenu
            interval={interval}
            onChange={(next) => {
              setSort(next.sort as FeedSort)

              if (next.interval) {
                setInterval(next.interval)
              }
            }}
            sort={sort}
            type="feed"
          />
        ) : null,
    })
  })

  return (
    <Drawer
      drawerStyle={styles.drawer}
      onClose={() => {
        setOpen(false)
      }}
      onOpen={() => {
        setOpen(true)
      }}
      open={open}
      renderDrawerContent={() => (
        <HomeDrawer
          community={data.community}
          feed={data.feed}
          onChange={(next) => {
            setData(next)
          }}
          onClose={() => {
            setOpen(false)
          }}
          type={data.type}
          user={data.user}
        />
      )}
      swipeEdgeWidth={theme.space[3]}
    >
      <PostList
        community={
          data.community
            ? data.community
            : data.type === 'home'
              ? undefined
              : data.type
        }
        feed={data.feed}
        interval={interval}
        label="subreddit"
        sort={sort}
        user={data.user}
      />
    </Drawer>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  drawer: {
    backgroundColor: theme.colors.gray[1],
  },
}))
