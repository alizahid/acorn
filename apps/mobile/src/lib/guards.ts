import { type Comment, type Post } from '@acorn/reddit'

export function isComment(item: Post | Comment): item is Comment {
  return item.type === 'reply' || item.type === 'more'
}

export function isPost(item: Post | Comment): item is Post {
  return !isComment(item)
}
