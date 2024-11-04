import { dateFromUnix } from '~/lib/intl'
import { removePrefix } from '~/lib/reddit'
import { type NotificationsSchema } from '~/schemas/notifications'
import { type Notification } from '~/types/notification'

export function transformNotification(
  data: NotificationsSchema['data']['children'][number],
): Notification | null {
  if (data.kind !== 't1') {
    return null
  }

  return {
    author: data.data.author,
    context: data.data.context,
    createdAt: dateFromUnix(data.data.created_utc),
    id: removePrefix(data.data.id),
    new: data.data.new,
    subreddit: data.data.subreddit,
    type: data.data.type,
  }
}
