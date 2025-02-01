import { type Comment } from '~/types/comment'
import { type Post } from '~/types/post'

export function isComment(item: Post | Comment): item is Comment {
  return item.type === 'reply' || item.type === 'more'
}

export function isPost(item: Post | Comment): item is Post {
  return !isComment(item)
}
