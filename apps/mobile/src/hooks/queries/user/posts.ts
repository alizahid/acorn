import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { PostsSchema } from '~/schemas/posts'
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
    accountId?: string
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
  const { accountId } = useAuth()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<
    Page,
    Error,
    UserPostsQueryData,
    UserPostsQueryKey,
    Param
  >({
    enabled: Boolean(accountId),
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

      if (sort === 'top' && interval) {
        url.searchParams.set('t', interval)
      }

      const payload = await reddit({
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
        accountId,
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
    posts: data?.pages.flatMap((page) => page.posts) ?? [],
    refetch,
  }
}
