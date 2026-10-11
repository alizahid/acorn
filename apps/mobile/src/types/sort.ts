import { type enums } from '@acorn/reddit'

export type SortType = 'feed' | 'community' | 'user' | 'comment' | 'search'

export type PostSort =
  | FeedSort
  | CommunityFeedSort
  | UserFeedSort
  | CommentSort
  | SearchSort

// feed

export const FeedType = ['home', 'popular', 'all'] as const

export type FeedType = (typeof FeedType)[number]

// The sorts each screen offers, as Reddit's own values. Reddit accepts more
// (AWARDED, QA, RANDOM, …); these are the ones Acorn shows.

// home

export const FeedSort = [
  'NEW',
  'BEST',
  'TOP',
  'RISING',
  'HOT',
] as const satisfies ReadonlyArray<enums.PostFeedSort>

export type FeedSort = (typeof FeedSort)[number]

// community

export const CommunityFeedSort = [
  'NEW',
  'TOP',
  'RISING',
  'HOT',
  'CONTROVERSIAL',
] as const satisfies ReadonlyArray<enums.PostFeedSort>

export type CommunityFeedSort = (typeof CommunityFeedSort)[number]

// user

export const UserFeedSort = [
  'NEW',
  'TOP',
  'HOT',
] as const satisfies ReadonlyArray<enums.ProfileFeedSort>

export type UserFeedSort = (typeof UserFeedSort)[number]

// comment

export const CommentSort = [
  'CONFIDENCE',
  'TOP',
  'NEW',
  'OLD',
  'CONTROVERSIAL',
] as const satisfies ReadonlyArray<enums.CommentSort>

export type CommentSort = (typeof CommentSort)[number]

// search

export const SearchSort = [
  'RELEVANCE',
  'HOT',
  'TOP',
  'NEW',
  'COMMENTS',
] as const satisfies ReadonlyArray<enums.SearchPostSort>

export type SearchSort = (typeof SearchSort)[number]

export const SortOptions = {
  comment: CommentSort,
  community: CommunityFeedSort,
  feed: FeedSort,
  search: SearchSort,
  user: UserFeedSort,
} as const satisfies Record<SortType, ReadonlyArray<PostSort>>

// top

export const TopInterval = [
  'HOUR',
  'DAY',
  'WEEK',
  'MONTH',
  'YEAR',
  'ALL',
] as const satisfies ReadonlyArray<enums.PostFeedRange>

export type TopInterval = (typeof TopInterval)[number]
