import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import { REDDIT_URI, redditApi } from '~/lib/reddit'
import { PostsSchema } from '~/schemas/reddit/posts'
import { useAuth } from '~/stores/auth'
import { transformPost } from '~/transformers/post'
import { type Post } from '~/types/post'
import { type TopInterval, type UserFeedSort } from '~/types/sort'
import { type UserFeedType } from '~/types/user'

type Param = string | undefined | null

type Page = {
  cursor: Param
  posts: Array<Post>
}

export type UserPostsQueryKey = [
  'posts',
  string,
  {
    interval?: TopInterval
    sort?: UserFeedSort
    type: UserFeedType
  },
]

export type UserPostsQueryData = InfiniteData<Page, Param>

export type UserPostsProps = {
  interval?: TopInterval
  sort: UserFeedSort
  type: UserFeedType
  username: string
}

export function useUserPosts({
  interval,
  sort,
  type,
  username,
}: UserPostsProps) {
  const { accessToken, expired } = useAuth()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useInfiniteQuery<
    Page,
    Error,
    UserPostsQueryData,
    UserPostsQueryKey,
    Param
  >({
    enabled: !expired,
    getNextPageParam(page) {
      return page.cursor
    },
    initialPageParam: null,
    async queryFn({ pageParam }) {
      const url = new URL(`/user/${username}/${type}`, REDDIT_URI)

      url.searchParams.set('limit', '25')
      url.searchParams.set('type', 'links')
      url.searchParams.set('sort', sort)

      if (pageParam) {
        url.searchParams.set('after', pageParam)
      }

      if (interval) {
        url.searchParams.set('t', interval)
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
      username,
      {
        interval,
        sort,
        type,
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
