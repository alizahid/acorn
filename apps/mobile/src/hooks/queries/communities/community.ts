import { useIsRestoring, useQuery } from '@tanstack/react-query'

import { queryClient } from '~/lib/query'
import { reddit } from '~/reddit/api'
import { CommunitySchema } from '~/schemas/communities'
import { useAuth } from '~/stores/auth'
import { transformCommunity } from '~/transformers/community'
import { type Community } from '~/types/community'

import { type CommunitiesQueryData } from './communities'

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

  const isRestoring = useIsRestoring()

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
    isLoading: isRestoring || isLoading,
    refetch,
  }
}

function getCommunity(name: string) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['communities'],
  })

  for (const query of queries) {
    const data = query.state.data as CommunitiesQueryData | undefined

    if (!data) {
      continue
    }

    for (const page of data.pages) {
      for (const community of page.communities) {
        if (community.name === name) {
          return community
        }
      }
    }
  }
}
