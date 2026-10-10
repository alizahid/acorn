import { type Community } from '@acorn/reddit'
import { useQuery } from '@tanstack/react-query'
import { orderBy } from 'lodash'
import { create, type Draft } from 'mutative'
import { useShallow } from 'zustand/react/shallow'

import { queryClient } from '~/lib/query'
import { createApi } from '~/reddit/api'
import { useAuth } from '~/stores/auth'

export type CommunitiesQueryKey = [
  'communities',
  {
    accountId?: string
  },
]

export type CommunitiesQueryData = Array<Community>

export function useCommunities() {
  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const { data, isLoading, refetch } = useQuery<
    CommunitiesQueryData,
    Error,
    CommunitiesQueryData,
    CommunitiesQueryKey
  >({
    networkMode: 'offlineFirst',
    queryFn() {
      return fetchCommunities()
    },
    queryKey: [
      'communities',
      {
        accountId,
      },
    ],
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
  const reddit = await createApi()

  const { communities, cursor } = await reddit.communities.mine({
    after,
  })

  if (cursor) {
    return [...communities, ...(await fetchCommunities(cursor))]
  }

  return communities
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
            if (community.name === name || community.name === `u/${name}`) {
              updater(community)

              break
            }
          }
        })
      },
    )
  }
}
