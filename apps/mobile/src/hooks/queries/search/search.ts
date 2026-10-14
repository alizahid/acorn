import { type Community, type Post, type User } from '@acorn/reddit'
import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { uniqBy } from 'lodash'
import { create, type Draft } from 'mutative'
import { useMemo } from 'react'
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

type Param = string | undefined | null

type SearchItem<Type extends SearchTab> = Type extends 'community'
  ? Community
  : Type extends 'user'
    ? User
    : Post

type Page<Type extends SearchTab> = {
  cursor: Param
  results: Array<SearchItem<Type>>
}

export type SearchQueryData<Type extends SearchTab> = InfiniteData<
  Page<Type>,
  Param
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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<
    Page<Type>,
    Error,
    SearchQueryData<Type>,
    SearchQueryKey,
    Param
  >({
    enabled: Boolean(accountId) && query.length > 2,
    getNextPageParam(page) {
      return page.cursor
    },
    initialPageParam: null,
    async queryFn({ pageParam }) {
      const reddit = await createApi()

      const input = {
        after: pageParam ?? undefined,
        community,
        query,
      }

      if (type === 'community') {
        const { communities, cursor } = await reddit.search.communities(input)

        return {
          cursor,
          results: (await filterCommunities(communities)) as Array<
            SearchItem<Type>
          >,
        }
      }

      if (type === 'user') {
        const { cursor, users } = await reddit.search.users(input)

        return {
          cursor,
          results: (await filterUsers(users)) as Array<SearchItem<Type>>,
        }
      }

      const { cursor, posts } = await reddit.search.posts({
        ...input,
        sort,
        time: interval,
      })

      return {
        cursor,
        results: (await filterPosts(posts)) as Array<SearchItem<Type>>,
      }
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

  const results = useMemo(
    () =>
      uniqBy(
        data?.pages.flatMap((page) => page.results) ?? [],
        (item) => item.id,
      ),
    [data?.pages],
  )

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    results,
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

    for (const page of data.pages) {
      for (const post of page.results) {
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
          loop: for (const page of draft.pages) {
            for (const post of page.results) {
              if (post.id === id) {
                updater(post)

                break loop
              }
            }
          }
        })
      },
    )
  }
}
