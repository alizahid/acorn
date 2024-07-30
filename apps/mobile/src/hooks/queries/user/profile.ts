import { useQuery } from '@tanstack/react-query'

import { redditApi } from '~/lib/reddit'
import { ProfileSchema } from '~/schemas/reddit/profile'
import { useAuth } from '~/stores/auth'
import { transformProfile } from '~/transformers/profile'
import { type Profile } from '~/types/user'

export type ProfileQueryKey = ['profile']

export type ProfileQueryData = Profile

export function useProfile() {
  const { accessToken, expired } = useAuth()

  const { data, isLoading, isRefetching, refetch } = useQuery<
    ProfileQueryData,
    Error,
    ProfileQueryData | undefined,
    ProfileQueryKey
  >({
    enabled: !expired,
    async queryFn() {
      const payload = await redditApi({
        accessToken,
        url: '/api/v1/me',
      })

      const profile = ProfileSchema.parse(payload)

      return transformProfile(profile) satisfies ProfileQueryData
    },
    queryKey: ['profile'],
  })

  return {
    isLoading,
    isRefetching,
    profile: data,
    refetch,
  }
}
