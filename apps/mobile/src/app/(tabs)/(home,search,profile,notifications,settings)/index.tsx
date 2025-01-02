import { useFocusEffect, useNavigation } from 'expo-router'
import { useState } from 'react'
import { type ViewStyle } from 'react-native'
import { Drawer } from 'react-native-drawer-layout'
import {
  createStyleSheet,
  type UnistylesValues,
  useStyles,
} from 'react-native-unistyles'

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

  const listProps = useList({
    padding: iPad
      ? {
          bottom: theme.space[4],
          horizontal: theme.space[4],
          top: homeFeed.community ? 0 : theme.space[4],
        }
      : undefined,
  })

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
          disabled={iPad}
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
      drawerStyle={styles.drawer() as ViewStyle}
      drawerType={iPad ? 'permanent' : 'front'}
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
            <CommunitySearchBar
              name={homeFeed.community}
              style={styles.search()}
            />
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

const stylesheet = createStyleSheet((theme, runtime) => ({
  drawer: () => {
    const base: UnistylesValues = {
      backgroundColor: theme.colors.gray[1],
    }

    if (iPad) {
      return {
        ...base,
        maxWidth:
          runtime.screen.width <= 744 ? runtime.screen.width * 0.35 : undefined,
      }
    }

    return base
  },
  overlay: {
    backgroundColor: theme.colors.gray.a6,
  },
  search: () => {
    if (iPad) {
      return {
        borderBottomColor: theme.colors.gray.a6,
        borderBottomWidth: runtime.hairlineWidth,
        marginBottom: theme.space[4],
        marginHorizontal: -theme.space[4],
      }
    }

    return {}
  },
}))
