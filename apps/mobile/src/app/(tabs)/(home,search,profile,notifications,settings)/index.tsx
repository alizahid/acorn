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
import { useSorting } from '~/hooks/sorting'
import { iPad } from '~/lib/common'
import { useDefaults } from '~/stores/defaults'

export default function Screen() {
  const navigation = useNavigation()

  const { homeFeed, update: updateDefaults } = useDefaults()

  const { styles, theme } = useStyles(stylesheet)

  const listProps = useList()

  const [open, setOpen] = useState(false)

  const { sorting, update: updateSorting } = useSorting(
    homeFeed.community ? 'community' : homeFeed.user ? 'user' : 'feed',
    homeFeed.community ??
      homeFeed.user ??
      homeFeed.feed ??
      homeFeed.type ??
      'home',
  )

  useFocusEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <FeedTypeMenu
          data={homeFeed}
          onPress={() => {
            setOpen((previous) => !previous)
          }}
        />
      ),
      headerRight: () =>
        !homeFeed.user ? (
          <SortIntervalMenu
            interval={sorting.interval}
            onChange={(next) => {
              updateSorting(next)
            }}
            sort={sorting.sort}
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
      drawerStyle={styles.drawer()}
      drawerType={iPad ? 'permanent' : 'front'}
      onClose={() => {
        setOpen(false)
      }}
      onOpen={() => {
        setOpen(true)
      }}
      open={iPad ? true : open}
      overlayStyle={styles.overlay}
      renderDrawerContent={() => (
        <HomeDrawer
          data={homeFeed}
          onChange={(next) => {
            updateDefaults({
              homeFeed: next,
            })
          }}
          onClose={() => {
            setOpen(false)
          }}
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
        interval={sorting.interval}
        label="subreddit"
        listProps={listProps}
        sort={sorting.sort}
        user={homeFeed.user}
      />
    </Drawer>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  drawer: () => {
    const base = {
      backgroundColor: theme.colors.gray[1],
    }

    if (iPad) {
      return {
        ...base,
        maxWidth: 300,
      }
    }

    return base
  },
  overlay: {
    backgroundColor: theme.colors.gray.a6,
  },
}))
