import {
  type InfiniteData,
  type QueryKey,
  useInfiniteQuery,
  useIsRestoring,
} from '@tanstack/react-query'
import { create } from 'mutative'

import { getHistory } from '~/lib/db/history'
import { queryClient, resetInfiniteQuery } from '~/lib/query'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { PostsSchema } from '~/schemas/posts'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import { transformPost } from '~/transformers/post'
import { type Post } from '~/types/post'
import { type FeedSort, type TopInterval } from '~/types/sort'

type Param = string | undefined | null

type Page = {
  cursor: Param
  posts: Array<Post>
}

export type PostsQueryKey = [
  'posts',
  {
    accountId?: string
    community?: string
    interval?: TopInterval
    sort?: FeedSort
  },
]

export type PostsQueryData = InfiniteData<Page, Param>

export type PostsProps = {
  community?: string
  interval?: TopInterval
  sort: FeedSort
}

export function usePosts({ community, interval, sort }: PostsProps) {
  const isRestoring = useIsRestoring()

  const { accountId } = useAuth()
  const { hideSeen } = usePreferences()

  const queryKey: PostsQueryKey = [
    'posts',
    {
      accountId,
      community,
      interval,
      sort,
    },
  ]

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isStale,
    refetch: refresh,
  } = useInfiniteQuery<Page, Error, PostsQueryData, PostsQueryKey, Param>({
    enabled: Boolean(accountId),
    initialPageParam: null,
    async queryFn({ pageParam }) {
      const path = community ? `/r/${community}/${sort}` : `/${sort}`

      const url = new URL(path, REDDIT_URI)

      url.searchParams.set('limit', '100')
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

      const response = PostsSchema.parse(payload)

      const seen = await getHistory(
        response.data.children.map((item) => item.data.id),
      )

      return {
        cursor: response.data.after,
        posts: response.data.children
          .filter((item) => (hideSeen ? !seen.includes(item.data.id) : true))
          .map((item) => transformPost(item.data, seen)),
      }
    },
    // eslint-disable-next-line sort-keys-fix/sort-keys-fix -- go away
    getNextPageParam(page) {
      return page.cursor
    },
    queryKey,
  })

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isRestoring || isLoading,
    isRefreshing: isStale && isFetching && !isLoading,
    posts: data?.pages.flatMap((page) => page.posts) ?? [],
    refetch: async () => {
      resetInfiniteQuery(queryKey)

      await refresh()
    },
  }
}

export function updatePosts(id: string, updater: (draft: Post) => void) {
  const cache = queryClient.getQueryCache()

  const queryKey: QueryKey = ['posts']

  const queries = cache.findAll({
    queryKey,
  })

  for (const query of queries) {
    queryClient.setQueryData<PostsQueryData>(query.queryKey, (previous) => {
      if (!previous) {
        return previous
      }

      return create(previous, (draft) => {
        let found = false

        for (const page of draft.pages) {
          if (found) {
            break
          }

          for (const post of page.posts) {
            if (post.id === id) {
              updater(post)

              found = true

              break
            }
          }
        }
      })
    })
  }
}
