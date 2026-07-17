import { Stack, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { SearchBox } from '~/components/common/search'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useListProps } from '~/hooks/list'
import { glass, iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { UserFeedType } from '~/types/user'

const schema = z.object({
  name: z.string().catch('mildpanda'),
  type: z.enum(UserFeedType).catch('submitted'),
})

export type UserPostsParams = z.infer<typeof schema>

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const { intervalUserPosts, sortUserPosts } = usePreferences(
    useShallow((state) => ({
      intervalUserPosts: state.intervalUserPosts,
      sortUserPosts: state.sortUserPosts,
    })),
  )

  styles.useVariants({
    iPad,
  })

  const [sort, setSort] = useState(sortUserPosts)
  const [interval, setInterval] = useState(intervalUserPosts)
  const [query, setQuery] = useState('')

  const [debounced] = useDebounce(query, 500)

  const listProps = useListProps()

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.View>
          <SortIntervalMenu
            interval={interval}
            onChange={(next) => {
              setSort(next.sort)

              if (next.interval) {
                setInterval(next.interval)
              }
            }}
            sort={sort}
            style={styles.sort}
            type="user"
          />
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      <PostList
        header={
          <View style={styles.header}>
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
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    borderBottomColor: theme.colors.gray.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  sort: {
    gap: theme.space[1],
    paddingHorizontal: glass ? theme.space[1] : 0,
  },
}))
