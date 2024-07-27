import { type PostMediaMeta } from './post'

export type Comment = {
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
