import { useQuery } from '@tanstack/react-query'
import { create } from 'mutative'

import { queryClient } from '~/lib/query'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { CommunitiesSchema } from '~/schemas/communities'
import { PostsSchema } from '~/schemas/posts'
import { useAuth } from '~/stores/auth'
import { transformCommunity } from '~/transformers/community'
import { transformPost } from '~/transformers/post'
import { type Community } from '~/types/community'
import { type Post } from '~/types/post'
import { type SearchType } from '~/types/search'
import { type SearchSort, type TopInterval } from '~/types/sort'

export type SearchQueryKey = [
  'search',
  {
    community?: string
    interval?: TopInterval
    query: string
    sort?: SearchSort
    type: SearchType
  },
]

export type SearchQueryData<Type extends SearchType> = Array<
  Type extends 'community' ? Community : Post
>

export type SearchProps<Type extends SearchType> = {
  community?: string
  interval?: TopInterval
  query: string
  sort?: SearchSort
  type: Type
}

export function useSearch<Type extends SearchType>({
  community,
  interval,
  query,
  sort,
  type,
}: SearchProps<Type>) {
  const { accountId } = useAuth()

  const { data, isLoading, refetch } = useQuery<
    SearchQueryData<Type> | undefined,
    Error,
    SearchQueryData<Type>,
    SearchQueryKey
  >({
    enabled: Boolean(accountId) && query.length > 0,
    async queryFn() {
      const path = community ? `/r/${community}/search` : '/search'

      const url = new URL(path, REDDIT_URI)

      url.searchParams.set('q', query)
      url.searchParams.set('type', type === 'community' ? 'sr' : 'link')

      if (type === 'post') {
        if (sort) {
          url.searchParams.set('sort', sort)
        }

        if (interval) {
          url.searchParams.set('t', interval)
        }
      }

      const payload = await reddit({
        url,
      })

      if (type === 'community') {
        const response = CommunitiesSchema.parse(payload)

        return response.data.children
          .filter((item) => item.data.subreddit_type === 'public')
          .map((item) => transformCommunity(item.data)) as SearchQueryData<Type>
      }

      if (type === 'post') {
        const response = PostsSchema.parse(payload)

        return response.data.children.map((item) =>
          transformPost(item.data),
        ) as SearchQueryData<Type>
      }

      return []
    },
    queryKey: [
      'search',
      {
        community,
        interval,
        query,
        sort,
        type,
      },
    ],
  })

  return {
    isLoading,
    refetch,
    results: data ?? [],
  }
}

export function updateSearch(id: string, updater: (draft: Post) => void) {
  const cache = queryClient.getQueryCache()

  const queryKey = [
    'search',
    {
      type: 'post',
    },
  ]

  const queries = cache.findAll({
    queryKey,
  })

  for (const query of queries) {
    queryClient.setQueryData<SearchQueryData<'post'>>(
      query.queryKey,
      (previous) => {
        if (!previous) {
          return previous
        }

        return create(previous, (draft) => {
          for (const post of draft) {
            if (post.id === id) {
              updater(post)

              break
            }
          }
        })
      },
    )
  }
}
