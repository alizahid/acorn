import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useState } from 'react'
import { type ViewStyle } from 'react-native'
import { Drawer } from 'react-native-drawer-layout'
import {
  createStyleSheet,
  type UnistylesValues,
  useStyles,
} from 'react-native-unistyles'
import { z } from 'zod'

import { HomeDrawer } from '~/components/home/drawer'
import { FeedTypeMenu } from '~/components/home/type-menu'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useList } from '~/hooks/list'
import { useSorting } from '~/hooks/sorting'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { FeedType } from '~/types/sort'

const schema = z.object({
  feed: z.string().optional(),
  type: z.enum(FeedType).catch('home'),
})

export default function Screen() {
  const navigation = useNavigation()
  const params = schema.parse(useLocalSearchParams())

  const { themeOled } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const listProps = useList({
    padding: iPad ? theme.space[4] : undefined,
  })

  const type = params.feed
    ? 'community'
    : params.type === 'home'
      ? 'feed'
      : 'community'

  const { sorting, update: updateSorting } = useSorting(
    type,
    params.feed ?? params.type,
  )

  const [open, setOpen] = useState(false)

  useFocusEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <FeedTypeMenu
          data={params}
          disabled={iPad}
          onPress={() => {
            setOpen((previous) => !previous)
          }}
        />
      ),
      headerRight: () => (
        <SortIntervalMenu
          interval={sorting.interval}
          onChange={(next) => {
            updateSorting(next)
          }}
          sort={sorting.sort}
          type={type}
        />
      ),
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
      overlayStyle={styles.overlay(themeOled)}
      renderDrawerContent={() => (
        <HomeDrawer
          onClose={() => {
            setOpen(false)
          }}
        />
      )}
    >
      <PostList
        community={params.type === 'home' ? undefined : params.type}
        feed={params.feed}
        interval={sorting.interval}
        label="subreddit"
        listProps={listProps}
        sort={sorting.sort}
      />
    </Drawer>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  drawer: () => {
    const base: UnistylesValues = {
      backgroundColor: theme.colors.gray.ui,
    }

    if (iPad) {
      return {
        ...base,
        maxWidth: 300,
        width: runtime.screen.width * 0.4,
      }
    }

    return base
  },
  overlay: (oled: boolean) => ({
    backgroundColor: oled
      ? oledTheme[theme.name].overlay
      : theme.colors.gray.border,
  }),
}))
