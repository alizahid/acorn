import { decode } from 'entities'

import { TYPE_COMMENT, TYPE_LINK } from '~/lib/const'
import { getMeta } from '~/lib/media'
import { type CommentsSchema } from '~/schemas/reddit/comments'
import { type Comment } from '~/types/comment'

export function transformComment(
  data: CommentsSchema['data']['children'][number],
): Comment {
  if (data.kind === 'more') {
    return {
      data: {
        children: data.data.children,
        count: data.data.count,
        depth: data.data.depth,
        id: data.data.id,
        parentId: data.data.parent_id,
      },
      type: 'more',
    }
  }

  return {
    data: {
      body: decode(data.data.body.trim()),
      createdAt: new Date(data.data.created * 1_000),
      depth: data.data.depth ?? 0,
      id: data.data.id,
      liked: data.data.likes,
      media: {
        meta: getMeta(data.data),
      },
      parentId: data.data.parent_id.startsWith(TYPE_LINK)
        ? undefined
        : data.data.parent_id.slice(TYPE_COMMENT.length),
      saved: data.data.saved,
      user: {
        name: data.data.author,
      },
      votes: data.data.ups,
    },
    type: 'reply',
  }
}
