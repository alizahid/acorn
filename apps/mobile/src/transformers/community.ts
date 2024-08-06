import { fromUnixTime } from 'date-fns'
import { decode } from 'entities'

import { type CommunityDataSchema } from '~/schemas/reddit/communities'
import { type Community } from '~/types/community'

export function transformCommunity(data: CommunityDataSchema): Community {
  return {
    createdAt: fromUnixTime(data.created),
    id: data.id,
    image: decode(data.icon_img) || decode(data.community_icon) || undefined,
    name: data.display_name.startsWith('u_')
      ? `u/${data.display_name.slice(2)}`
      : data.display_name,
    subscribed: data.user_is_subscriber,
    subscribers: data.subscribers,
  }
}
