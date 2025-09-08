import { fromUnixTime } from 'date-fns'
import { decode } from 'entities'

import { removePrefix } from '~/lib/reddit'
import { type InboxSchema } from '~/schemas/inbox'
import { type Notification } from '~/types/inbox'

export function transformInboxItem(
  data: InboxSchema['data']['children'][number],
): Notification {
  return {
    author: data.data.author,
    body: decode(data.data.body),
    context: data.data.context,
    createdAt: fromUnixTime(data.data.created_utc),
    id: removePrefix(data.data.id),
    new: data.data.new,
    subreddit: data.data.subreddit,
    type: data.data.type,
  }
}
