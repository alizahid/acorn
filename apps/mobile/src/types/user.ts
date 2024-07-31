export type Profile = {
  createdAt: Date
  id: string
  image?: string
  karma: {
    comment: number
    post: number
    total: number
  }
  name: string
}

export const UserFeedType = [
  'submitted',
  'comments',
  'saved',
  'upvoted',
  'downvoted',
] as const

export type UserFeedType = (typeof UserFeedType)[number]
