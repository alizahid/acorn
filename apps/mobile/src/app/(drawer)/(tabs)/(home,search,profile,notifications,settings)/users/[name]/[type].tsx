import { useLocalSearchParams } from 'expo-router'
import { useMemo, useState } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { SearchBox } from '~/components/common/search'
import { View } from '~/components/common/view'
import { type HeaderProps } from '~/components/navigation/header'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useList } from '~/hooks/list'
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
  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('screen.profile')

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

  const sticky = useMemo<HeaderProps>(
    () => ({
      back: true,
      children: (
        <View direction="row" style={styles.header}>
          <SearchBox onChange={setQuery} value={query} />
        </View>
      ),
      right: (
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
      title: t(params.type),
    }),
    [params.type, query, t, interval, sort],
  )

  return (
    <PostList
      interval={interval}
      listProps={listProps}
      query={debounced}
      sort={sort}
      sticky={sticky}
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
    paddingTop: heights.header,
    variants: {
      iPad: {
        true: {
          paddingBottom: theme.space[4],
          paddingHorizontal: theme.space[4],
          paddingTop: heights.header + theme.space[4],
        },
      },
    },
  },
}))
