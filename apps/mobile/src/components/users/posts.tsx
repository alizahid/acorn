import { Stack } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { useShallow } from 'zustand/react/shallow'

import { SearchBox } from '~/components/common/search'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useListProps } from '~/hooks/list'
import { glass } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { type UserPostsType } from '~/types/user'

type Props = {
  name: string
  type: UserPostsType
}

export function UserPostsList({ name, type }: Props) {
  const { intervalUserPosts, sortUserPosts } = usePreferences(
    useShallow((state) => ({
      intervalUserPosts: state.intervalUserPosts,
      sortUserPosts: state.sortUserPosts,
    })),
  )

  const [sort, setSort] = useState(sortUserPosts)
  const [interval, setInterval] = useState(intervalUserPosts)
  const [query, setQuery] = useState('')

  const [debounced] = useDebounce(query, 500)

  const listProps = useListProps(true)

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
        user={name}
        userType={type}
      />
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    borderBottomColor: theme.colors.gray.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sort: {
    gap: theme.space[1],
    paddingHorizontal: glass ? theme.space[1] : 0,
  },
}))
