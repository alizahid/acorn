import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useState } from 'react'
import { z } from 'zod'

import { CommentsSortMenu } from '~/components/comments/sort'
import { TopIntervalMenu } from '~/components/posts/interval'
import { UserCommentsList } from '~/components/users/comments'
import { usePreferences } from '~/stores/preferences'

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
        <>
          <CommentsSortMenu
            hideLabel
            onChange={(next) => {
              setSort(next)
            }}
            value={sort}
          />

          {sort === 'top' ? (
            <TopIntervalMenu
              hideLabel
              onChange={(next) => {
                setInterval(next)
              }}
              value={interval}
            />
          ) : null}
        </>
      ),
    })
  })

  return (
    <UserCommentsList interval={interval} sort={sort} username={params.name} />
  )
}
