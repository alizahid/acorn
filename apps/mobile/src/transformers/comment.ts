import { fromUnixTime } from 'date-fns'
import { decode } from 'entities'

import { getMeta } from '~/lib/media'
import { removePrefix } from '~/lib/reddit'
import { type CommentsSchema } from '~/schemas/comments'
import { type UserDataSchema } from '~/schemas/users'
import { type Comment } from '~/types/comment'

import { transformFlair } from './flair'

export function transformComment(
  data: CommentsSchema['data']['children'][number],
  users?: UserDataSchema,
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

  const user = data.data.author_fullname
    ? users?.[data.data.author_fullname]
    : undefined

  return {
    data: {
      body: decode(data.data.body).trim(),
      community: {
        id: removePrefix(data.data.subreddit_id),
        name: data.data.subreddit,
      },
      createdAt: fromUnixTime(data.data.created_utc),
      depth: data.data.depth ?? 0,
      flair: transformFlair(data.data.author_flair_richtext),
      id: removePrefix(data.data.id),
      liked: data.data.likes,
      media: {
        meta: getMeta(data.data),
      },
      op: data.data.is_submitter,
      parentId: parentId === postId ? undefined : parentId,
      permalink: data.data.permalink,
      post: {
        author: data.data.link_author,
        id: postId,
        permalink: data.data.link_permalink,
        title: data.data.link_title,
      },
      saved: data.data.saved,
      sticky: Boolean(data.data.stickied),
      user: {
        id: data.data.author_fullname
          ? removePrefix(data.data.author_fullname)
          : undefined,
        image: user?.profile_img ? decode(user.profile_img) : undefined,
        name: data.data.author,
      },
      votes: data.data.ups,
    },
    type: 'reply',
  }
}
