import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import { REDDIT_URI } from '~/lib/const'
import { redditApi } from '~/lib/reddit'
import { PostsSchema } from '~/schemas/reddit/posts'
import { useAuth } from '~/stores/auth'
import { transformPost } from '~/transformers/post'
import { type Post } from '~/types/post'

export const FeedType = ['new', 'best', 'top', 'rising', 'hot'] as const

export type FeedType = (typeof FeedType)[number]

type Param = string | undefined | null

type Page = {
  after: Param
  posts: Array<Post>
}

export type PostsQueryKey = ['posts', FeedType]

export type PostsQueryData = InfiniteData<Page, Param>

export function usePosts(type: FeedType) {
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
      const url = new URL(`/${type}`, REDDIT_URI)

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
        posts: response.data.children.map((item) => transformPost(item.data)),
      } satisfies Page
    },
    queryKey: ['posts', type],
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
