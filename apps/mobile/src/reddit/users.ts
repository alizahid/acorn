import { UserDataSchema } from '~/schemas/users'

import { reddit } from './api'
import { REDDIT_URI } from './config'

export type UserProfiles = Awaited<ReturnType<typeof fetchUserData>>

export async function fetchUserData(...userIds: Array<string>) {
  try {
    const url = new URL('/api/user_data_by_account_ids', REDDIT_URI)

    url.searchParams.set('ids', userIds.join(','))

    const response = await reddit({
      url,
    })

    return UserDataSchema.parse(response)
  } catch {
    return {}
  }
}
