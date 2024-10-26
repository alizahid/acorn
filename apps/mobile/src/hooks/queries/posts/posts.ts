import {
  type InfiniteData,
  useInfiniteQuery,
  useIsRestoring,
} from '@tanstack/react-query'
import { compact, uniqBy } from 'lodash'
import { create } from 'mutative'
import { useMemo } from 'react'

import { queryClient, resetInfiniteQuery } from '~/lib/query'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { PostsSchema } from '~/schemas/posts'
import { useAuth } from '~/stores/auth'
import { useHistory } from '~/stores/history'
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
  const seen = useHistory((state) => state.posts)

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
    isFetchingNextPage,
    isLoading,
    refetch: refresh,
  } = useInfiniteQuery<Page, Error, PostsQueryData, PostsQueryKey, Param>({
    enabled: Boolean(accountId),
    initialPageParam: null,
    async queryFn({ pageParam }) {
      const path = community ? `/r/${community}/${sort}` : `/${sort}`

      const url = new URL(path, REDDIT_URI)

      url.searchParams.set('limit', '50')

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

      return {
        cursor: response.data.after,
        posts: compact(
          response.data.children.map((item) => {
            if (hideSeen && seen.includes(item.data.id)) {
              return null
            }

            return transformPost(item.data)
          }),
        ),
      }
    },
    // eslint-disable-next-line sort-keys-fix/sort-keys-fix -- go away
    getNextPageParam(page) {
      return page.cursor
    },
    queryKey,
  })

  const posts = useMemo(
    () => uniqBy(data?.pages.flatMap((page) => page.posts) ?? [], 'id'),
    [data?.pages],
  )

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isRestoring || isLoading,
    posts,
    refetch: async () => {
      resetInfiniteQuery(queryKey)

      await refresh()
    },
  }
}

export function updatePosts(id: string, updater: (draft: Post) => void) {
  const cache = queryClient.getQueryCache()

  const queryKey = ['posts']

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
