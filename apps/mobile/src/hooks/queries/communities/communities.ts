import { useQuery } from '@tanstack/react-query'
import { orderBy } from 'lodash'
import { create, type Draft } from 'mutative'

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
  const { accountId } = useAuth()

  const queryKey: CommunitiesQueryKey = [
    'communities',
    {
      accountId,
    },
  ]

  const { data, isLoading, refetch } = useQuery<
    CommunitiesQueryData,
    Error,
    CommunitiesQueryData,
    CommunitiesQueryKey
  >({
    enabled: Boolean(accountId),
    networkMode: 'offlineFirst',
    async queryFn() {
      return fetchCommunities()
    },
    queryKey,
  })

  return {
    communities: orderBy(
      (data ?? []).filter((item) => !item.user),
      ['favorite', (item) => item.name.toLowerCase()],
      ['desc', 'asc'],
    ),
    isLoading,
    refetch,
    users: orderBy(
      (data ?? []).filter((item) => item.user),
      ['favorite', (item) => item.name.toLowerCase()],
      ['desc', 'asc'],
    ),
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
