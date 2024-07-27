import { type CommunitiesSchema } from '~/schemas/reddit/communities'
import { type Community } from '~/types/community'

export function transformCommunity(
  data: CommunitiesSchema['data']['children'][number],
): Community {
  return {
    id: data.data.id,
    image: data.data.icon_img,
    name: data.data.display_name,
  }
}
