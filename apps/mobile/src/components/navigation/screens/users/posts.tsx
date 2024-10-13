import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
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

  const { intervalUserPosts, sortUserPosts, update } = usePreferences()

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <FeedSortMenu
            hideLabel
            onChange={(next) => {
              update({
                sortUserPosts: next,
              })
            }}
            type="user"
            value={sortUserPosts}
          />

          {sortUserPosts === 'top' ? (
            <TopIntervalMenu
              hideLabel
              onChange={(next) => {
                update({
                  intervalUserPosts: next,
                })
              }}
              value={intervalUserPosts}
            />
          ) : null}
        </>
      ),
    })
  })

  return (
    <UserPostsList
      interval={intervalUserPosts}
      label="subreddit"
      sort={sortUserPosts}
      type={params.type}
      username={params.name}
    />
  )
}
