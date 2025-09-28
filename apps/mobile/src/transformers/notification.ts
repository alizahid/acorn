import { fromUnixTime } from 'date-fns'

import { decodeHtml } from '~/lib/html'
import { removePrefix } from '~/lib/reddit'
import { type NotificationsSchema } from '~/schemas/notifications'
import { type Notification } from '~/types/notification'

export function transformNotification(
  data: NotificationsSchema['data']['children'][number],
): Notification {
  if (data.kind === 't4') {
    throw new Error('invalid')
  }

  return {
    author: data.data.author,
    body: decodeHtml(data.data.body_html)!,
    context: data.data.context,
    createdAt: fromUnixTime(data.data.created_utc),
    id: removePrefix(data.data.id),
    new: data.data.new,
    subreddit: data.data.subreddit,
    type: data.data.type,
  }
}
