import { useIsRestoring, useQuery } from '@tanstack/react-query'
import { sortBy, uniq } from 'lodash'
import { create, type Draft } from 'mutative'
import { useMemo } from 'react'

import { queryClient } from '~/lib/query'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { CommunitiesSchema } from '~/schemas/communities'
import { useAuth } from '~/stores/auth'
import { transformCommunity } from '~/transformers/community'
import { type Community } from '~/types/community'

export type CommunitiesQueryKey = [
  'communities',
  {
    accountId?: string
  },
]

export type CommunitiesQueryData = Array<Community>

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
    isFetching,
    isLoading,
    isStale,
    refetch: refresh,
  } = useQuery<
    CommunitiesQueryData,
    Error,
    CommunitiesQueryData,
    CommunitiesQueryKey
  >({
    enabled: Boolean(accountId),
    async queryFn() {
      return fetchCommunities()
    },
    queryKey,
  })

  const communities = useMemo(() => transform(data ?? [], false), [data])
  const users = useMemo(() => transform(data ?? [], true), [data])

  return {
    communities,
    isLoading: isRestoring || isLoading,
    isRefreshing: isStale && isFetching && !isLoading,
    refetch: refresh,
    users,
  }
}

async function fetchCommunities(after?: string): Promise<CommunitiesQueryData> {
  const url = new URL('/subreddits/mine', REDDIT_URI)

  url.searchParams.set('limit', '100')

  if (after) {
    url.searchParams.set('after', after)
  }

  const payload = await reddit({
    url,
  })

  const response = CommunitiesSchema.parse(payload)

  if (response.data.after) {
    return [
      ...response.data.children.map((item) => transformCommunity(item.data)),
      ...(await fetchCommunities(response.data.after)),
    ]
  }

  return response.data.children.map((item) => transformCommunity(item.data))
}

function transform(communities: Array<Community>, isUser: boolean) {
  const list = sortBy(communities, (community) =>
    community.name.toLowerCase(),
  ).filter((community) => community.user === isUser)

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

export function updateCommunities(
  name: string,
  updater: (draft: Draft<Community>) => void,
) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['communities', {}] satisfies CommunitiesQueryKey,
  })

  for (const query of queries) {
    queryClient.setQueryData<CommunitiesQueryData>(
      query.queryKey,
      (previous) => {
        if (!previous) {
          return previous
        }

        return create(previous, (draft) => {
          for (const community of draft) {
            if (community.name === name) {
              updater(community)

              break
            }
          }
        })
      },
    )
  }
}
