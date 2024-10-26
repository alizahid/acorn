import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useState } from 'react'
import { z } from 'zod'

import { TopIntervalMenu } from '~/components/posts/interval'
import { FeedSortMenu } from '~/components/posts/sort'
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
        <>
          <FeedSortMenu
            hideLabel
            onChange={(next) => {
              setSort(next)
            }}
            type="user"
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
    <UserPostsList
      interval={interval}
      label="subreddit"
      sort={sort}
      type={params.type}
      username={params.name}
    />
  )
}
