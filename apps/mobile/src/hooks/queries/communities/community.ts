import { useQuery } from '@tanstack/react-query'

import { queryClient } from '~/lib/query'
import { redditApi } from '~/lib/reddit'
import { CommunitySchema } from '~/schemas/reddit/communities'
import { useAuth } from '~/stores/auth'
import { transformCommunity } from '~/transformers/community'
import { type Community } from '~/types/community'

import { type CommunitiesQueryData } from './communities'

export type CommunityQueryKey = ['community', string]

export type CommunityQueryData = Community

export function useCommunity(name: string) {
  const { accessToken, expired } = useAuth()

  const { data, isLoading, isRefetching, refetch } = useQuery<
    CommunityQueryData | undefined,
    Error,
    CommunityQueryData,
    CommunityQueryKey
  >({
    enabled: !expired,
    initialData() {
      return getCommunity(name)
    },
    async queryFn() {
      const payload = await redditApi({
        accessToken,
        url: `/r/${name}/about`,
      })

      const response = CommunitySchema.parse(payload)

      return transformCommunity(response.data)
    },
    queryKey: ['community', name],
    staleTime({ state }) {
      if (!state.data) {
        return 0
      }

      return Infinity
    },
  })

  return {
    community: data,
    isLoading,
    isRefetching,
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
