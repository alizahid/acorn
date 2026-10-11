import { type Community } from '@acorn/reddit'
import { useQuery } from '@tanstack/react-query'
import { create, type Draft } from 'mutative'
import { useShallow } from 'zustand/react/shallow'

import { queryClient } from '~/lib/query'
import { createApi } from '~/reddit/api'
import { useAuth } from '~/stores/auth'
import { type Undefined } from '~/types'

import {
  type CommunitiesQueryData,
  type CommunitiesQueryKey,
} from './communities'

export type CommunityQueryKey = [
  'community',
  {
    accountId?: string
    name: string
  },
]

export type CommunityQueryData = Community

export function useCommunity(name: string) {
  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const { data, isLoading, refetch } = useQuery<
    Undefined<CommunityQueryData>,
    Error,
    CommunityQueryData,
    CommunityQueryKey
  >({
    placeholderData(previous) {
      if (previous) {
        return
      }

      return getCommunity(name)
    },
    async queryFn() {
      const reddit = await createApi()

      const community = await reddit.communities.get({
        name,
      })

      if (!community) {
        throw new Error('Community not found')
      }

      return community
    },
    queryKey: [
      'community',
      {
        accountId,
        name,
      },
    ],
  })

  return {
    community: data,
    isLoading,
    refetch,
  }
}

function getCommunity(name: string) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['communities', {}] satisfies CommunitiesQueryKey,
  })

  for (const query of queries) {
    const data = query.state.data as Undefined<CommunitiesQueryData>

    if (!data) {
      continue
    }

    for (const community of data) {
      if (community.name === name) {
        return community
      }
    }
  }
}

export function updateCommunity(
  name: string,
  updater: (draft: Draft<CommunityQueryData>) => void,
) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: [
      'community',
      {
        name,
      },
    ] satisfies CommunityQueryKey,
  })

  for (const query of queries) {
    queryClient.setQueryData<CommunityQueryData>(query.queryKey, (previous) => {
      if (!previous) {
        return previous
      }

      return create(previous, (draft) => {
        updater(draft)
      })
    })
  }
}
