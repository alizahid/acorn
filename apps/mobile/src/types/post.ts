export type Post = {
  comments: number
  content?: string
  createdAt: Date
  id: string
  liked: boolean | null
  media: {
    images?: Array<PostImage>
    video?: PostVideo
  }
  permalink: string
  read: boolean
  saved: boolean
  spoiler: boolean
  subreddit: string
  title: string
  user: {
    id: string
    name: string
  }
  votes: number
}

export type PostImage = {
  height: number
  url: string
  width: number
}

export type PostVideo = PostImage & {
  provider: 'reddit' | 'redgifs'
}
