import {
  type InfiniteData,
  useInfiniteQuery,
  useIsRestoring,
} from '@tanstack/react-query'
import { compact } from 'lodash'

import { getHistory } from '~/lib/db/history'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { SavedPostsSchema } from '~/schemas/posts'
import { useAuth } from '~/stores/auth'
import { transformComment } from '~/transformers/comment'
import { transformPost } from '~/transformers/post'
import { type Comment } from '~/types/comment'
import { type Post } from '~/types/post'
import { type TopInterval, type UserFeedSort } from '~/types/sort'
import { type UserFeedType } from '~/types/user'

type Param = string | undefined | null

type Page = {
  cursor: Param
  posts: Array<Post | Comment>
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
  const isRestoring = useIsRestoring()

  const { accountId } = useAuth()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isStale,
    refetch,
  } = useInfiniteQuery<
    Page,
    Error,
    UserPostsQueryData,
    UserPostsQueryKey,
    Param
  >({
    enabled: Boolean(accountId),
    initialPageParam: null,
    async queryFn({ pageParam }) {
      const url = new URL(`/user/${username}/${type}`, REDDIT_URI)

      url.searchParams.set('limit', '100')
      url.searchParams.set('sort', sort)
      url.searchParams.set('sr_detail', 'true')

      if (sort === 'top' && interval) {
        url.searchParams.set('t', interval)
      }

      if (pageParam) {
        url.searchParams.set('after', pageParam)
      }

      const payload = await reddit({
        url,
      })

      const response = SavedPostsSchema.parse(payload)

      const seen = await getHistory(
        compact(
          response.data.children.map((item) =>
            item.kind === 't3' ? item.data.id : null,
          ),
        ),
      )

      return {
        cursor: response.data.after,
        posts: compact(
          response.data.children.map((item) => {
            if (item.kind === 't1') {
              const comment = transformComment(item)

              return comment
            }

            return transformPost(item.data, seen)
          }),
        ),
      }
    },
    // eslint-disable-next-line sort-keys-fix/sort-keys-fix -- go away
    getNextPageParam(page) {
      return page.cursor
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
    isLoading: isRestoring || isLoading,
    isRefreshing: isStale && isFetching && !isLoading,
    posts: data?.pages.flatMap((page) => page.posts) ?? [],
    refetch,
  }
}
