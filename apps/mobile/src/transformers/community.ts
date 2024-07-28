import { decode } from 'entities'

import { type CommunitiesSchema } from '~/schemas/reddit/communities'
import { type Community } from '~/types/community'

export function transformCommunity(
  data: CommunitiesSchema['data']['children'][number],
): Community {
  return {
    id: data.data.id,
    image:
      decode(data.data.icon_img) ||
      decode(data.data.community_icon) ||
      undefined,
    name: data.data.display_name,
  }
}
