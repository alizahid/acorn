import { UserDataSchema } from '~/schemas/users'

import { reddit } from './api'
import { REDDIT_URI, USER_AGENT } from './config'

export async function getId(accessToken: string) {
  const url = new URL('/api/v1/me', REDDIT_URI)

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      'user-agent': USER_AGENT,
    },
  })

  const json = (await response.json()) as
    | {
        name: string
      }
    | undefined

  return json?.name
}

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
