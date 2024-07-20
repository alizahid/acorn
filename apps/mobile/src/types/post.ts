export type Post = {
  comments: number
  createdAt: Date
  id: string
  media: {
    images?: Array<PostImage>
    video?: PostVideo
  }
  permalink: string
  read: boolean
  saved: boolean
  text?: string
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
