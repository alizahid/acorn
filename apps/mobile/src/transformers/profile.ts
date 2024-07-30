import { decode } from 'entities'

import { type ProfileSchema } from '~/schemas/reddit/profile'
import { type Profile } from '~/types/user'

export function transformProfile(data: ProfileSchema): Profile {
  return {
    createdAt: new Date(data.created * 1_000),
    id: data.id,
    image: decode(data.icon_img) || undefined,
    karma: {
      comment: data.comment_karma,
      post: data.link_karma,
      total: data.total_karma,
    },
    name: data.name,
  }
}
