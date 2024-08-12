// home

export const FeedSort = ['new', 'best', 'top', 'rising', 'hot'] as const

export type FeedSort = (typeof FeedSort)[number]

// community

export const CommunityFeedSort = ['new', 'top', 'rising', 'hot'] as const

export type CommunityFeedSort = (typeof CommunityFeedSort)[number]

// user

export const UserFeedSort = ['new', 'top', 'hot'] as const

export type UserFeedSort = (typeof UserFeedSort)[number]

// comment

export const CommentFeedSort = [
  'confidence',
  'top',
  'new',
  'old',
  'controversial',
] as const

export type CommentFeedSort = (typeof CommentFeedSort)[number]

// top

export const TopInterval = [
  'hour',
  'day',
  'week',
  'month',
  'year',
  'all',
] as const

export type TopInterval = (typeof TopInterval)[number]
