export type Profile = {
  banner?: string
  createdAt: Date
  description?: string
  id: string
  image?: string
  karma: {
    comment: number
    post: number
    total: number
  }
  name: string
  noFollow: boolean
  subreddit: string
  subscribed: boolean
}

export type User = {
  createdAt: Date
  id: string
  image?: string
  name: string
}

export const UserFeedType = [
  'submitted',
  'comments',
  'saved',
  'upvoted',
  'downvoted',
  'hidden',
] as const

export type UserFeedType = (typeof UserFeedType)[number]

export const UserTab = ['posts', 'comments'] as const

export type UserTab = (typeof UserTab)[number]
