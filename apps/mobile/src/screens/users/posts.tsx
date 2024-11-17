import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useState } from 'react'
import { z } from 'zod'

import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { UserPostsList } from '~/components/users/posts'
import { usePreferences } from '~/stores/preferences'
import { UserFeedType } from '~/types/user'

const schema = z.object({
  name: z.string().catch('mildpanda'),
  type: z.enum(UserFeedType).catch('submitted'),
})

export type UserPostsParams = z.infer<typeof schema>

export function UserPostsScreen() {
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const { intervalUserPosts, sortUserPosts } = usePreferences()

  const [sort, setSort] = useState(sortUserPosts)
  const [interval, setInterval] = useState(intervalUserPosts)

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
          type="user"
        />
      ),
    })
  })

  return (
    <UserPostsList
      interval={interval}
      label="subreddit"
      sort={sort}
      type={params.type}
      username={params.name}
    />
  )
}
