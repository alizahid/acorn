import { fromUnixTime } from 'date-fns'

import { decodeHtml } from '~/lib/html'
import { removePrefix } from '~/lib/reddit'
import { type MessagesSchema } from '~/schemas/messages'
import { type Message } from '~/types/message'

export function transformMessage(
  data: MessagesSchema['data']['children'][number],
): Message {
  return {
    author: data.data.author ?? 'Unknown',
    body: decodeHtml(data.data.body_html)!,
    createdAt: fromUnixTime(data.data.created_utc),
    id: removePrefix(data.data.id),
    new: data.data.new,
    replies:
      typeof data.data.replies === 'object'
        ? data.data.replies.data.children.map((item) => transformMessage(item))
        : undefined,
    subject: data.data.subject,
  }
}
