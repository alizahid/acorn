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
