import { useQuery } from '@tanstack/react-query'
import { create, type Draft } from 'mutative'

import { queryClient } from '~/lib/query'
import { reddit } from '~/reddit/api'
import { CommunitySchema } from '~/schemas/communities'
import { useAuth } from '~/stores/auth'
import { transformCommunity } from '~/transformers/community'
import { type Community } from '~/types/community'

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
  const { accountId } = useAuth()

  const { data, isLoading, refetch } = useQuery<
    CommunityQueryData | undefined,
    Error,
    CommunityQueryData,
    CommunityQueryKey
  >({
    enabled: Boolean(accountId),
    placeholderData(previous) {
      if (previous) {
        return
      }

      return getCommunity(name)
    },
    async queryFn() {
      const payload = await reddit({
        url: `/r/${name}/about`,
      })

      const response = CommunitySchema.parse(payload)

      return transformCommunity(response.data)
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
    const data = query.state.data as CommunitiesQueryData | undefined

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
