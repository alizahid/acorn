import { decode } from 'entities'

import { type CommunityDataSchema } from '~/schemas/reddit/communities'
import { type Community } from '~/types/community'

export function transformCommunity(data: CommunityDataSchema): Community {
  return {
    id: data.id,
    image: decode(data.icon_img) || decode(data.community_icon) || undefined,
    name: data.display_name,
  }
}
