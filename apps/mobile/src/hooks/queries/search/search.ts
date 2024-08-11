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

export type SearchQueryKey = [
  'search',
  {
    community?: string
    query: string
    type: SearchType
  },
]

export type SearchQueryData<Type extends SearchType> = Array<
  Type extends 'community' ? Community : Post
>

export type SearchProps<Type extends SearchType> = {
  community?: string
  query: string
  type: Type
}

export function useSearch<Type extends SearchType>({
  community,
  query,
  type,
}: SearchProps<Type>) {
  const { expired } = useAuth()

  const { data, isLoading, isRefetching, refetch } = useQuery<
    SearchQueryData<Type> | undefined,
    Error,
    SearchQueryData<Type>,
    SearchQueryKey
  >({
    enabled: !expired && query.length > 0,
    async queryFn() {
      const path = community ? `/r/${community}/search` : '/search'

      const url = new URL(path, REDDIT_URI)

      url.searchParams.set('q', query)
      url.searchParams.set('type', type === 'community' ? 'sr' : 'link')

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
        query,
        type,
      },
    ],
  })

  return {
    isLoading,
    isRefetching,
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
