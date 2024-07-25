export type Comment = {
  body: string
  createdAt: Date
  id: string
  liked: boolean | null
  replies: Array<Comment>
  saved: boolean
  user: {
    name: string
  }
  votes: number
}
