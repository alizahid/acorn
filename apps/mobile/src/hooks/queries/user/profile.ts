import { useQuery } from '@tanstack/react-query'

import { reddit } from '~/reddit/api'
import { ProfileSchema } from '~/schemas/profile'
import { useAuth } from '~/stores/auth'
import { transformProfile } from '~/transformers/profile'
import { type Undefined } from '~/types'
import { type Profile } from '~/types/user'

export type ProfileQueryKey = [
  'users',
  {
    name: string
  },
]

export type ProfileQueryData = Profile

export function useProfile(name?: string) {
  const { accountId } = useAuth()

  const { data, isLoading, refetch } = useQuery<
    Undefined<ProfileQueryData>,
    Error,
    ProfileQueryData,
    ProfileQueryKey
  >({
    enabled: Boolean(accountId) && Boolean(name),
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
    profile: data,
    refetch,
  }
}
