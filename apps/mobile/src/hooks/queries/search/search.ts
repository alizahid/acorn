import { type Community, type Post, type User } from '@acorn/reddit'
import { useQuery } from '@tanstack/react-query'
import { create, type Draft } from 'mutative'
import { useShallow } from 'zustand/react/shallow'

import { filterCommunities, filterPosts, filterUsers } from '~/lib/filtering'
import { queryClient } from '~/lib/query'
import { createApi } from '~/reddit/api'
import { useAuth } from '~/stores/auth'
import { type Undefined } from '~/types'
import { type SearchTab } from '~/types/defaults'
import { type SearchSort, type TopInterval } from '~/types/sort'

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
  Type extends 'community' ? Community : Type extends 'user' ? User : Post
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
  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const { data, isLoading, refetch } = useQuery<
    Undefined<SearchQueryData<Type>>,
    Error,
    SearchQueryData<Type>,
    SearchQueryKey
  >({
    enabled: Boolean(accountId) && query.length > 2,
    async queryFn() {
      const reddit = await createApi()

      const input = {
        community,
        query,
      }

      if (type === 'community') {
        const { communities } = await reddit.search.communities(input)

        return (await filterCommunities(
          communities,
        )) satisfies Array<Community> as SearchQueryData<Type>
      }

      if (type === 'user') {
        const { users } = await reddit.search.users(input)

        return (await filterUsers(
          users,
        )) satisfies Array<User> as SearchQueryData<Type>
      }

      const { posts } = await reddit.search.posts({
        ...input,
        sort,
        time: interval,
      })

      return (await filterPosts(
        posts,
      )) satisfies Array<Post> as SearchQueryData<Type>
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

export function getPostFromSearch(id: string): Undefined<PostQueryData> {
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
    const data = query.state.data as Undefined<SearchQueryData<'post'>>

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
