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
  createdAt: Date
  crossPost?: Post
  id: string
  liked: boolean | null
  media: {
    images?: Array<PostMedia>
    meta: PostMediaMeta
    video?: PostMedia
  }
  nsfw: boolean
  permalink: string
  read: boolean
  saved: boolean
  spoiler: boolean
  subreddit: string
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
  provider?: 'redgifs'
  type: 'image' | 'video' | 'gif'
  url: string
  width: number
}

export type PostMediaMeta = Record<string, PostMedia>
