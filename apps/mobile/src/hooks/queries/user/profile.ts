import { useQuery } from '@tanstack/react-query'

import { redditApi } from '~/lib/reddit'
import { ProfileSchema } from '~/schemas/profile'
import { useAuth } from '~/stores/auth'
import { transformProfile } from '~/transformers/profile'
import { type Profile } from '~/types/user'

export type ProfileQueryKey = ['users', string]

export type ProfileQueryData = Profile

export function useProfile(name?: string) {
  const { accessToken, expired } = useAuth()

  const { data, isLoading, isRefetching, refetch } = useQuery<
    ProfileQueryData | undefined,
    Error,
    ProfileQueryData,
    ProfileQueryKey
  >({
    enabled: !expired || !name,
    async queryFn() {
      const payload = await redditApi({
        accessToken,
        url: `/user/${name!}/about`,
      })

      const profile = ProfileSchema.parse(payload)

      return transformProfile(profile)
    },
    queryKey: ['users', name!],
  })

  return {
    isLoading,
    isRefetching,
    profile: data,
    refetch,
  }
}
