import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useState } from 'react'
import { useStyles } from 'react-native-unistyles'
import { useDebounce } from 'use-debounce'
import { z } from 'zod'

import { CommentList } from '~/components/comments/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { UserSearchBar } from '~/components/users/search'
import { useList } from '~/hooks/list'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  mode: z.literal('headless').optional(),
  name: z.string().catch('mildpanda'),
})

export default function Screen() {
  const navigation = useNavigation()
  const params = schema.parse(useLocalSearchParams())

  const { intervalUserComments, sortUserComments } = usePreferences()

  const { theme } = useStyles()

  const listProps = useList({
    padding: iPad ? theme.space[4] : 0,
    top: params.mode === 'headless' ? 0 : theme.space[7] + theme.space[4],
  })

  const [sort, setSort] = useState(sortUserComments)
  const [interval, setInterval] = useState(intervalUserComments)
  const [query, setQuery] = useState('')

  const [debounced] = useDebounce(query, 500)

  useFocusEffect(() => {
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
          type="comment"
        />
      ),
    })
  })

  return (
    <CommentList
      header={<UserSearchBar onChange={setQuery} value={query} />}
      interval={interval}
      listProps={listProps}
      query={debounced}
      sort={sort}
      user={params.name}
    />
  )
}
