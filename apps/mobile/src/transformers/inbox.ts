import { decode } from 'entities'

import { dateFromUnix } from '~/lib/intl'
import { removePrefix } from '~/lib/reddit'
import { type InboxSchema } from '~/schemas/inbox'
import { type InboxItem } from '~/types/inbox'

export function transformInboxItem(
  data: InboxSchema['data']['children'][number],
): InboxItem {
  if (data.kind === 't1') {
    return {
      data: {
        author: data.data.author,
        body: decode(data.data.body).trim(),
        context: data.data.context,
        createdAt: dateFromUnix(data.data.created_utc),
        id: removePrefix(data.data.id),
        new: data.data.new,
        subreddit: data.data.subreddit,
        type: data.data.type,
      },
      type: 'notification',
    }
  }

  return {
    data: {
      author: data.data.author,
      body: decode(data.data.body).trim(),
      createdAt: dateFromUnix(data.data.created_utc),
      id: removePrefix(data.data.id),
      new: data.data.new,
      subject: data.data.subject,
    },
    type: 'message',
  }
}