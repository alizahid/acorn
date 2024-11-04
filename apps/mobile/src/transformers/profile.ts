import { decode } from 'entities'

import { dateFromUnix } from '~/lib/intl'
import { removePrefix } from '~/lib/reddit'
import { type ProfileSchema } from '~/schemas/profile'
import { type Profile } from '~/types/user'

export function transformProfile({ data }: ProfileSchema): Profile {
  return {
    createdAt: dateFromUnix(data.created_utc),
    id: removePrefix(data.id),
    image: decode(data.icon_img) || undefined,
    karma: {
      comment: data.comment_karma,
      post: data.link_karma,
      total: data.total_karma,
    },
    name: data.name,
    noFollow: Boolean(data.no_follow),
    subreddit: removePrefix(data.subreddit.name),
    subscribed: data.subreddit.user_is_subscriber,
  }
}
