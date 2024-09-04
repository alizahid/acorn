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
  subreddit: string
  subscribed: boolean
}

export const UserFeedType = [
  'submitted',
  'comments',
  'saved',
  'upvoted',
  'downvoted',
] as const

export type UserFeedType = (typeof UserFeedType)[number]

export const UserTab = ['posts', 'comments'] as const

export type UserTab = (typeof UserTab)[number]
