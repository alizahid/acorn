import { decode } from 'entities'
import { compact } from 'lodash'

import { type CommentsSchema } from '~/schemas/reddit/comments'
import { type Comment } from '~/types/comment'

export function transformComment(
  data: CommentsSchema['data']['children'][number],
): Comment | null {
  if (data.kind === 'more') {
    return null
  }

  return {
    body: decode(data.data.body.trim()),
    createdAt: new Date(data.data.created * 1_000),
    id: data.data.id,
    liked: data.data.likes,
    replies: compact(
      data.data.replies.data.children.map((item) => transformComment(item)),
    ),
    saved: data.data.saved,
    user: {
      name: data.data.author,
    },
    votes: data.data.ups,
  }
}
