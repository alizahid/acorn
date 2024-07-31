export type PostType =
  | 'link'
  | 'text'
  | 'gallery'
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
  type: PostType
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

export type PostImage = {
  height: number
  type: 'image' | 'video' | 'gif'
  url: string
  width: number
}

export type PostVideo = PostImage & {
  provider: 'reddit' | 'redgifs'
}
