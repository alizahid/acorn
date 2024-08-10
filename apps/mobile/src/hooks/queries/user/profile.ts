import { useQuery } from '@tanstack/react-query'

import { reddit } from '~/reddit/api'
import { ProfileSchema } from '~/schemas/profile'
import { useAuth } from '~/stores/auth'
import { transformProfile } from '~/transformers/profile'
import { type Profile } from '~/types/user'

export type ProfileQueryKey = [
  'users',
  {
    name: string
  },
]

export type ProfileQueryData = Profile

export function useProfile(name?: string) {
  const { expired } = useAuth()

  const { data, isLoading, isRefetching, refetch } = useQuery<
    ProfileQueryData | undefined,
    Error,
    ProfileQueryData,
    ProfileQueryKey
  >({
    enabled: !expired && Boolean(name),
    async queryFn() {
      const payload = await reddit({
        url: `/user/${name!}/about`,
      })

      const profile = ProfileSchema.parse(payload)

      return transformProfile(profile)
    },
    queryKey: [
      'users',
      {
        name: name!,
      },
    ],
  })

  return {
    isLoading,
    isRefetching,
    profile: data,
    refetch,
  }
}
