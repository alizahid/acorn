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

export const FeedTypeSubreddit = ['new', 'top', 'rising', 'hot'] as const

export type FeedTypeSubreddit = (typeof FeedType)[number]

type Param = string | undefined | null

type Page = {
  after: Param
  posts: Array<Post>
}

export type PostsQueryKey = ['posts', FeedType, string?]

export type PostsQueryData = InfiniteData<Page, Param>

export function usePosts(type: FeedType, subreddit?: string) {
  const { accessToken, expired } = useAuth()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useInfiniteQuery<Page, Error, PostsQueryData, PostsQueryKey, Param>({
    enabled: !expired,
    getNextPageParam(page) {
      return page.after
    },
    initialPageParam: null,
    async queryFn({ pageParam }) {
      const parts = compact([subreddit ? `r/${subreddit}` : null, type]).join(
        '/',
      )

      const url = new URL(`/${parts}`, REDDIT_URI)

      url.searchParams.set('limit', '25')

      if (pageParam) {
        url.searchParams.set('after', pageParam)
      }

      const payload = await redditApi({
        accessToken,
        url,
      })

      const response = PostsSchema.parse(payload)

      return {
        after: response.data.after,
        posts: response.data.children.map((item) => transformPost(item)),
      } satisfies Page
    },
    queryKey: ['posts', type, subreddit],
  })

  return {
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    posts: data?.pages.flatMap((page) => page.posts) ?? [],
    refetch,
  }
}
