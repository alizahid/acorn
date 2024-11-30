import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useState } from 'react'
import { z } from 'zod'

import { CommentList } from '~/components/comments/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useList } from '~/hooks/list'
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  name: z.string().catch('mildpanda'),
})

export default function UserCommentsScreen() {
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const { intervalUserComments, sortUserComments } = usePreferences()

  const listProps = useList()

  const [sort, setSort] = useState(sortUserComments)
  const [interval, setInterval] = useState(intervalUserComments)

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
      interval={interval}
      listProps={listProps}
      sort={sort}
      user={params.name}
    />
  )
}
