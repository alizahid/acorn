import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useCallback, useState } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import { SearchBox } from '~/components/common/search'
import { View } from '~/components/common/view'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useList } from '~/hooks/list'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { UserFeedType } from '~/types/user'

const schema = z.object({
  name: z.string().catch('mildpanda'),
  type: z.enum(UserFeedType).catch('submitted'),
})

export type UserPostsParams = z.infer<typeof schema>

export default function Screen() {
  const navigation = useNavigation()
  const params = schema.parse(useLocalSearchParams())

  const { intervalUserPosts, sortUserPosts, themeOled, themeTint } =
    usePreferences()

  styles.useVariants({
    iPad,
    oled: themeOled,
    tint: themeTint,
  })

  const listProps = useList()

  const [sort, setSort] = useState(sortUserPosts)
  const [interval, setInterval] = useState(intervalUserPosts)
  const [query, setQuery] = useState('')

  const [debounced] = useDebounce(query, 500)

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <SortIntervalMenu
            interval={interval}
            onChange={(next) => {
              setSort(next.sort)

              if (next.interval) {
                setInterval(next.interval)
              }
            }}
            sort={sort}
            type="user"
          />
        ),
      })
    }, [interval, navigation.setOptions, sort]),
  )

  return (
    <PostList
      header={
        <View direction="row" style={styles.header}>
          <SearchBox onChange={setQuery} value={query} />
        </View>
      }
      interval={interval}
      listProps={listProps}
      query={debounced}
      sort={sort}
      style={styles.list}
      user={params.name}
      userType={params.type}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    backgroundColor: theme.colors.gray.bg,
    variants: {
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bgAlpha,
          borderBottomColor: theme.colors.gray.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
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
          paddingBottom: theme.space[4],
          paddingHorizontal: theme.space[4],
          paddingTop: theme.space[4],
        },
      },
    },
  },
}))
