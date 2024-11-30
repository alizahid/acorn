import { useFocusEffect, useNavigation } from 'expo-router'
import { useState } from 'react'
import { Drawer } from 'react-native-drawer-layout'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { CommunitySearchBar } from '~/components/communities/search-bar'
import { HomeDrawer } from '~/components/home/drawer'
import { FeedTypeMenu } from '~/components/home/type-menu'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useList } from '~/hooks/list'
import { useDefaults } from '~/stores/defaults'
import { usePreferences } from '~/stores/preferences'

export function HomeScreen() {
  const navigation = useNavigation()

  const { intervalFeedPosts, sortFeedPosts } = usePreferences()
  const { homeFeed, update } = useDefaults()

  const { styles, theme } = useStyles(stylesheet)

  const listProps = useList()

  const [open, setOpen] = useState(false)
  const [sort, setSort] = useState(sortFeedPosts)
  const [interval, setInterval] = useState(intervalFeedPosts)

  useFocusEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <FeedTypeMenu
          community={homeFeed.community}
          feed={homeFeed.feed}
          onPress={() => {
            setOpen((previous) => !previous)
          }}
          type={homeFeed.type}
          user={homeFeed.user}
        />
      ),
      headerRight: () =>
        !homeFeed.user ? (
          <SortIntervalMenu
            interval={interval}
            onChange={(next) => {
              setSort(next.sort)

              if (next.interval) {
                setInterval(next.interval)
              }
            }}
            sort={sort}
            type={
              homeFeed.community
                ? 'community'
                : homeFeed.user
                  ? 'user'
                  : homeFeed.type === 'all' || homeFeed.type === 'popular'
                    ? 'community'
                    : 'feed'
            }
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
      overlayStyle={styles.overlay}
      renderDrawerContent={() => (
        <HomeDrawer
          community={homeFeed.community}
          feed={homeFeed.feed}
          listProps={listProps}
          onChange={(next) => {
            update({
              homeFeed: next,
            })

            if (sort === 'best' && !next.feed && next.type !== 'home') {
              setSort('hot')
            }
          }}
          onClose={() => {
            setOpen(false)
          }}
          type={homeFeed.type}
          user={homeFeed.user}
        />
      )}
      swipeEdgeWidth={theme.space[3]}
    >
      <PostList
        community={
          homeFeed.community
            ? homeFeed.community
            : homeFeed.type === 'home'
              ? undefined
              : homeFeed.type
        }
        feed={homeFeed.feed}
        header={
          homeFeed.community ? (
            <CommunitySearchBar name={homeFeed.community} />
          ) : undefined
        }
        interval={interval}
        label="subreddit"
        listProps={listProps}
        sort={sort}
        user={homeFeed.user}
      />
    </Drawer>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  drawer: {
    backgroundColor: theme.colors.gray[1],
  },
  overlay: {
    backgroundColor: theme.colors.gray.a6,
  },
}))
