import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useState } from 'react'
import { z } from 'zod'

import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { UserCommentsList } from '~/components/users/comments'
import { usePreferences } from '~/stores/preferences'
import { type CommentSort } from '~/types/sort'

const schema = z.object({
  name: z.string().catch('mildpanda'),
})

export default function UserCommentsScreen() {
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const { intervalUserComments, sortUserComments } = usePreferences()

  const [sort, setSort] = useState(sortUserComments)
  const [interval, setInterval] = useState(intervalUserComments)

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SortIntervalMenu
          interval={interval}
          onChange={(next) => {
            setSort(next.sort as CommentSort)

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
    <UserCommentsList interval={interval} sort={sort} username={params.name} />
  )
}
