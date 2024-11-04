import { decode } from 'entities'

import { dateFromUnix } from '~/lib/intl'
import { removePrefix } from '~/lib/reddit'
import { type UserSchema } from '~/schemas/users'
import { type SearchUser } from '~/types/user'

export function transformSearchUser(data: UserSchema): SearchUser | null {
  if (!data.id || !data.created_utc) {
    return null
  }

  return {
    createdAt: dateFromUnix(data.created_utc),
    id: removePrefix(data.id),
    image: data.icon_img ? decode(data.icon_img) || undefined : undefined,
    name: data.name,
  }
}
