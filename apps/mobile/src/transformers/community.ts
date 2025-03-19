import { fromUnixTime } from 'date-fns'
import { decode } from 'entities'

import { removePrefix } from '~/lib/reddit'
import { type CommunityDataSchema } from '~/schemas/communities'
import { type Community } from '~/types/community'

export function transformCommunity(data: CommunityDataSchema): Community {
  const user = data.display_name.startsWith('u_')

  return {
    banner: data.mobile_banner_image
      ? decode(data.mobile_banner_image) || undefined
      : data.banner_background_image
        ? decode(data.banner_background_image) || undefined
        : undefined,
    createdAt: fromUnixTime(data.created_utc ?? 0),
    description: data.public_description ? data.public_description : undefined,
    favorite: Boolean(data.user_has_favorited),
    id: removePrefix(data.name),
    image: data.community_icon
      ? decode(data.community_icon) || undefined
      : data.icon_img
        ? decode(data.icon_img) || undefined
        : undefined,
    name: user ? `u/${data.display_name.slice(2)}` : data.display_name,
    subscribed: Boolean(data.user_is_subscriber),
    subscribers: data.subscribers ?? 0,
    title: data.title ? data.title : undefined,
    user,
  }
}
