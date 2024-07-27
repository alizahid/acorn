import { type Comment } from './comment'

export type Post = {
  body?: string
  comments: number
  createdAt: Date
  id: string
  liked: boolean | null
  media: {
    images?: Array<PostImage>
    meta: PostMediaMeta
    video?: PostVideo
  }
  nsfw: boolean
  permalink: string
  read: boolean
  saved: boolean
  spoiler: boolean
  subreddit: string
  title: string
  url?: string
  user: {
    id: string
    name: string
  }
  votes: number
}

export type PostMediaMeta = Record<
  string,
  {
    height: number
    type: 'image' | 'video' | 'gif'
    url: string
    width: number
  }
>

export type PostWithComments = {
  comments: Array<Comment>
  post: Post
}

export type PostImage = {
  height: number
  type: 'image' | 'video' | 'gif'
  url: string
  width: number
}

export type PostVideo = PostImage & {
  provider: 'reddit' | 'redgifs'
}
