import { type Community } from './community'
import { type Flair } from './flair'

export type PostType =
  | 'link'
  | 'text'
  | 'image'
  | 'video'
  | 'poll'
  | 'crosspost'

export type Post = {
  body?: string
  comments: number
  community: Community
  createdAt: Date
  crossPost?: Post
  flair: Array<Flair>
  id: string
  liked: boolean | null
  media: {
    images?: Array<PostMedia>
    meta: PostMediaMeta
    video?: PostMedia
  }
  nsfw: boolean
  permalink: string
  saved: boolean
  spoiler: boolean
  sticky: boolean
  title: string
  type: PostType
  url?: string
  user: {
    id: string
    name: string
  }
  votes: number
}

export type PostMedia = {
  height: number
  provider?: 'reddit' | 'redgifs'
  thumbnail?: string
  type: 'image' | 'video' | 'gif'
  url: string
  width: number
}

export type PostMediaMeta = Record<string, PostMedia>
