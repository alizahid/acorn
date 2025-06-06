import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useState } from 'react'
import { type ViewStyle } from 'react-native'
import {
  createStyleSheet,
  type UnistylesValues,
  useStyles,
} from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import { SearchBox } from '~/components/common/search'
import { View } from '~/components/common/view'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { ListFlags, useList } from '~/hooks/list'
import { heights, iPad } from '~/lib/common'
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

  const { styles } = useStyles(stylesheet)

  const listProps = useList(ListFlags.BOTTOM)

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
    }, [interval, navigation, sort]),
  )

  return (
    <>
      <View
        direction="row"
        style={styles.header(themeOled, themeTint) as ViewStyle}
      >
        <SearchBox onChange={setQuery} value={query} />
      </View>

      <PostList
        interval={interval}
        listProps={listProps}
        query={debounced}
        sort={sort}
        style={styles.list}
        user={params.name}
        userType={params.type}
      />
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  header: (oled: boolean, tint: boolean) => {
    const base: UnistylesValues = {
      backgroundColor: oled
        ? oledTheme[theme.name].bgAlpha
        : theme.colors[tint ? 'accent' : 'gray'].bg,
      borderBottomColor: theme.colors.gray.border,
      borderBottomWidth: runtime.hairlineWidth,
      marginTop: heights.header + runtime.insets.top,
    }

    if (iPad) {
      return {
        ...base,
        marginBottom: theme.space[4],
      }
    }

    return base
  },
  list: {
    paddingBottom: iPad ? theme.space[4] : undefined,
    paddingHorizontal: iPad ? theme.space[4] : undefined,
  },
}))
