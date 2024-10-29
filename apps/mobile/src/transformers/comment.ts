import { decode } from 'entities'

import { dateFromUnix } from '~/lib/intl'
import { getMeta } from '~/lib/media'
import { removePrefix } from '~/lib/reddit'
import { type CommentsSchema } from '~/schemas/comments'
import { type Comment } from '~/types/comment'

import { transformFlair } from './flair'

export function transformComment(
  data: CommentsSchema['data']['children'][number],
): Comment {
  const parentId = removePrefix(data.data.parent_id)

  if (data.kind === 'more') {
    return {
      data: {
        children: data.data.children,
        count: data.data.count,
        depth: data.data.depth,
        id: data.data.id,
        parentId,
      },
      type: 'more',
    }
  }

  const postId = removePrefix(data.data.link_id)

  return {
    data: {
      body: decode(data.data.body.trim()),
      createdAt: dateFromUnix(data.data.created_utc),
      depth: data.data.depth ?? 0,
      flair: transformFlair(data.data.author_flair_richtext),
      id: data.data.id,
      liked: data.data.likes,
      media: {
        meta: getMeta(data.data),
      },
      op: data.data.is_submitter,
      parentId: parentId === postId ? undefined : parentId,
      postId,
      saved: data.data.saved,
      sticky: Boolean(data.data.stickied),
      user: {
        name: data.data.author,
      },
      votes: data.data.ups,
    },
    type: 'reply',
  }
}
