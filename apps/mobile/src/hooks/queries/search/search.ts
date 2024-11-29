import { useIsRestoring, useQuery } from '@tanstack/react-query'
import { compact } from 'lodash'
import { create, type Draft } from 'mutative'

import { getHistory } from '~/lib/db/history'
import { queryClient } from '~/lib/query'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { CommunitiesSchema } from '~/schemas/communities'
import { PostsSchema } from '~/schemas/posts'
import { UsersSchema } from '~/schemas/users'
import { useAuth } from '~/stores/auth'
import { transformCommunity } from '~/transformers/community'
import { transformPost } from '~/transformers/post'
import { transformSearchUser } from '~/transformers/user'
import { type Community } from '~/types/community'
import { type Post } from '~/types/post'
import { type SearchTab } from '~/types/search'
import { type SearchSort, type TopInterval } from '~/types/sort'
import { type SearchUser } from '~/types/user'

import { type PostQueryData } from '../posts/post'

export type SearchQueryKey = [
  'search',
  {
    community?: string
    interval?: TopInterval
    query: string
    sort?: SearchSort
    type: SearchTab
  },
]

export type SearchQueryData<Type extends SearchTab> = Array<
  Type extends 'community' ? Community : Type extends 'user' ? SearchUser : Post
>

export type SearchProps<Type extends SearchTab> = {
  community?: string
  interval?: TopInterval
  query: string
  sort?: SearchSort
  type: Type
}

export function useSearch<Type extends SearchTab>({
  community,
  interval,
  query,
  sort,
  type,
}: SearchProps<Type>) {
  const isRestoring = useIsRestoring()

  const { accountId } = useAuth()

  const { data, isLoading, refetch } = useQuery<
    SearchQueryData<Type> | undefined,
    Error,
    SearchQueryData<Type>,
    SearchQueryKey
  >({
    enabled: Boolean(accountId) && query.length > 2,
    async queryFn() {
      const path = community ? `/r/${community}/search` : '/search'

      const url = new URL(path, REDDIT_URI)

      url.searchParams.set('q', query)
      url.searchParams.set('limit', '100')
      url.searchParams.set(
        'type',
        type === 'community' ? 'sr' : type === 'user' ? 'user' : 'link',
      )

      if (community) {
        url.searchParams.set('restrict_sr', 'true')
      }

      if (type === 'post') {
        url.searchParams.set('sr_detail', 'true')

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

      if (type === 'user') {
        const response = UsersSchema.parse(payload)

        return compact(
          response.data.children.map((item) => transformSearchUser(item.data)),
        ) as SearchQueryData<Type>
      }

      if (type === 'post') {
        const response = PostsSchema.parse(payload)

        const seen = await getHistory(
          response.data.children.map((item) => item.data.id),
        )

        return response.data.children.map((item) =>
          transformPost(item.data, seen),
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
    isLoading: isRestoring || isLoading,
    refetch,
    results: data ?? [],
  }
}

export function getPostFromSearch(id: string): PostQueryData | undefined {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: [
      'search',
      {
        type: 'post',
      },
    ],
  })

  for (const query of queries) {
    const data = query.state.data as SearchQueryData<'post'> | undefined

    if (!data) {
      continue
    }

    for (const post of data) {
      if (post.id === id) {
        return {
          comments: [],
          post,
        }
      }

      if (post.crossPost?.id === id) {
        return {
          comments: [],
          post: post.crossPost,
        }
      }
    }
  }
}

export function updateSearch(
  id: string,
  updater: (draft: Draft<Post>) => void,
) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: [
      'search',
      {
        type: 'post',
      },
    ],
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
