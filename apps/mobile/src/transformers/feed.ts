import { fromUnixTime } from 'date-fns'
import { decode } from 'entities'

import { type FeedDataSchema } from '~/schemas/feeds'
import { type Feed } from '~/types/feed'

export function transformFeed(data: FeedDataSchema): Feed {
  return {
    communities: data.subreddits.map((community) => community.name),
    createdAt: fromUnixTime(data.created_utc),
    id: data.name,
    image: data.icon_url ? decode(data.icon_url) || undefined : undefined,
    name: data.display_name,
  }
}
