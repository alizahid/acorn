import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { create } from 'mutative'

import { queryClient } from '~/lib/query'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { PostsSchema } from '~/schemas/posts'
import { useAuth } from '~/stores/auth'
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
  const { accountId, expired } = useAuth()

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
      const path = community ? `/r/${community}` : `/${sort}`

      const url = new URL(path, REDDIT_URI)

      url.searchParams.set('limit', '50')

      if (pageParam) {
        url.searchParams.set('after', pageParam)
      }

      if (interval) {
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
      {
        accountId,
        community,
        interval,
        sort,
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
