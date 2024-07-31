import { type PostMediaMeta } from './post'

export type Comment =
  | {
      data: CommentReply
      type: 'reply'
    }
  | {
      data: CommentMore
      type: 'more'
    }

export type CommentReply = {
  body: string
  createdAt: Date
  depth: number
  id: string
  liked: boolean | null
  media: {
    meta: PostMediaMeta
  }
  parentId?: string
  saved: boolean
  user: {
    name: string
  }
  votes: number
}

export type CommentMore = {
  children: Array<string>
  count: number
  depth: number
  id: string
  parentId: string
}
