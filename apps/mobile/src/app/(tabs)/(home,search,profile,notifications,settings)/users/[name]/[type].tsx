import { useLocalSearchParams } from 'expo-router'
import { z } from 'zod'

import { UserPostsList } from '~/components/users/posts'
import { UserSavedList } from '~/components/users/saved'
import { UserFeedType } from '~/types/user'

const schema = z.object({
  name: z.string().catch('mildpanda'),
  type: z.enum(UserFeedType).catch('submitted'),
})

export type UserPostsParams = z.infer<typeof schema>

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  if (params.type === 'saved') {
    return <UserSavedList name={params.name} />
  }

  return <UserPostsList name={params.name} type={params.type} />
}
