import { decode } from 'entities'

import { dateFromUnix } from '~/lib/intl'
import { type CommunityDataSchema } from '~/schemas/communities'
import { type Community } from '~/types/community'

export function transformCommunity(data: CommunityDataSchema): Community {
  const user = data.display_name.startsWith('u_')

  return {
    createdAt: dateFromUnix(data.created_utc),
    id: data.id,
    image: data.icon_img
      ? decode(data.icon_img) || undefined
      : data.community_icon
        ? decode(data.community_icon) || undefined
        : undefined,
    name: user ? data.display_name.slice(2) : data.display_name,
    subscribed: Boolean(data.user_is_subscriber),
    subscribers: data.subscribers ?? 0,
    user,
  }
}
