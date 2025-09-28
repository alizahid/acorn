import { fromUnixTime } from 'date-fns'
import { last } from 'lodash'

import { decodeHtml } from '~/lib/html'
import { removePrefix } from '~/lib/reddit'
import { type MessagesSchema } from '~/schemas/messages'
import { type Message } from '~/types/message'

export function transformMessage(
  data: MessagesSchema['data']['children'][number],
): Message {
  const replies =
    typeof data.data.replies === 'object'
      ? data.data.replies.data.children.map((item) => transformMessage(item))
      : undefined

  const latest = last(replies)

  return {
    body: latest?.body ?? decodeHtml(data.data.body_html)!,
    createdAt: fromUnixTime(data.data.created_utc),
    from: data.data.author,
    id: removePrefix(data.data.id),
    new: data.data.new,
    replies,
    to: data.data.dest,
    updatedAt: latest?.createdAt ?? fromUnixTime(data.data.created_utc),
  }
}
