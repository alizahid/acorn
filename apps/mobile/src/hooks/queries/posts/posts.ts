import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { compact } from 'lodash'

import { REDDIT_URI } from '~/lib/const'
import { redditApi } from '~/lib/reddit'
import { PostsSchema } from '~/schemas/reddit/posts'
import { useAuth } from '~/stores/auth'
import { transformPost } from '~/transformers/post'
import { type Post } from '~/types/post'

export const FeedType = ['new', 'best', 'top', 'rising', 'hot'] as const

export type FeedType = (typeof FeedType)[number]

export const TopInterval = [
  'hour',
  'day',
  'week',
  'month',
  'year',
  'all',
] as const

export type TopInterval = (typeof TopInterval)[number]

export const FeedTypeSubreddit = ['new', 'top', 'rising', 'hot'] as const

export type FeedTypeSubreddit = (typeof FeedType)[number]

export const FeedTypeUser = ['new', 'top', 'hot'] as const

export type FeedTypeUser = (typeof FeedType)[number]

export const UserFeedType = [
  'submitted',
  'comments',
  'saved',
  'upvoted',
  'downvoted',
] as const

export type UserFeedType = (typeof UserFeedType)[number]

type Param = string | undefined | null

type Page = {
  cursor: Param
  posts: Array<Post>
}

export type PostsQueryKey = [
  'posts',
  {
    feedType?: FeedType
    interval?: TopInterval
    subreddit?: string
    userName?: string
    userType?: UserFeedType
  },
]

export type PostsQueryData = InfiniteData<Page, Param>

export type PostsProps = {
  interval?: TopInterval
  subreddit?: string
  type: FeedType
  userName?: string
  userType?: UserFeedType
}

export function usePosts({
  interval,
  subreddit,
  type,
  userName,
  userType,
}: PostsProps) {
  const { accessToken, expired } = useAuth()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useInfiniteQuery<Page, Error, PostsQueryData, PostsQueryKey, Param>({
    enabled: !expired,
    getNextPageParam(page) {
      return page.cursor
    },
    initialPageParam: null,
    async queryFn({ pageParam }) {
      const parts = (
        userName && userType
          ? ['user', userName, userType]
          : compact([subreddit ? `r/${subreddit}` : null, type])
      ).join('/')

      const url = new URL(`/${parts}`, REDDIT_URI)

      url.searchParams.set('limit', '25')

      if (pageParam) {
        url.searchParams.set('after', pageParam)
      }

      if (interval) {
        url.searchParams.set('t', interval)
      }

      if (userName && userType) {
        url.searchParams.set('sort', userType)
      }

      const payload = await redditApi({
        accessToken,
        url,
      })

      const response = PostsSchema.parse(payload)

      return {
        cursor: response.data.after,
        posts: response.data.children.map((item) => transformPost(item.data)),
      }
    },
    queryKey: [
      'posts',
      {
        feedType: type,
        interval,
        subreddit,
        userName,
        userType,
      },
    ],
  })

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    posts: data?.pages.flatMap((page) => page.posts) ?? [],
    refetch,
  }
}
