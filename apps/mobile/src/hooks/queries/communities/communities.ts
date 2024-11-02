import {
  type InfiniteData,
  useInfiniteQuery,
  useIsRestoring,
} from '@tanstack/react-query'
import { sortBy, uniq } from 'lodash'
import { useMemo } from 'react'

import { resetInfiniteQuery } from '~/lib/query'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { CommunitiesSchema } from '~/schemas/communities'
import { useAuth } from '~/stores/auth'
import { transformCommunity } from '~/transformers/community'
import { type Community } from '~/types/community'

type Param = string | undefined | null

type Page = {
  communities: Array<Community>
  cursor: Param
}

export type CommunitiesQueryKey = [
  'communities',
  {
    accountId?: string
  },
]

export type CommunitiesQueryData = InfiniteData<Page, Param>

export function useCommunities() {
  const isRestoring = useIsRestoring()

  const { accountId } = useAuth()

  const queryKey: CommunitiesQueryKey = [
    'communities',
    {
      accountId,
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
  } = useInfiniteQuery<
    Page,
    Error,
    CommunitiesQueryData,
    CommunitiesQueryKey,
    Param
  >({
    enabled: Boolean(accountId),
    initialPageParam: null,
    async queryFn({ pageParam }) {
      const url = new URL('/subreddits/mine', REDDIT_URI)

      url.searchParams.set('limit', '100')

      if (pageParam) {
        url.searchParams.set('after', pageParam)
      }

      const payload = await reddit({
        url,
      })

      const response = CommunitiesSchema.parse(payload)

      return {
        communities: response.data.children.map((item) =>
          transformCommunity(item.data),
        ),
        cursor: response.data.after,
      }
    },
    // eslint-disable-next-line sort-keys-fix/sort-keys-fix -- go away
    getNextPageParam(page) {
      return page.cursor
    },
    queryKey,
  })

  const communities = useMemo(
    () =>
      transform(data?.pages.flatMap((page) => page.communities) ?? [], false),
    [data?.pages],
  )

  const users = useMemo(
    () =>
      transform(data?.pages.flatMap((page) => page.communities) ?? [], true),
    [data?.pages],
  )

  return {
    communities,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isRestoring || isLoading,
    isRefreshing: isStale && isFetching && !isLoading,
    refetch: async () => {
      resetInfiniteQuery(queryKey)

      await refresh()
    },
    users,
  }
}

function transform(communities: Array<Community>, user: boolean) {
  const list = sortBy(communities, (community) =>
    community.name.toLowerCase(),
  ).filter((community) => community.user === user)

  const favorites = list.filter((community) => community.favorite)

  if (favorites.length > 0) {
    return [
      'favorites',
      ...favorites,
      ...filter(list.filter((community) => !community.favorite)),
    ]
  }

  return filter(list)
}

function filter(communities: Array<Community>) {
  return uniq(
    communities.flatMap((community) => [
      community.name.slice(0, 1).toLowerCase(),
      community,
    ]),
  )
}
