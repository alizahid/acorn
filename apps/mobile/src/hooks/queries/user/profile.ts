import { useQuery } from '@tanstack/react-query'
import { create, type Draft } from 'mutative'
import { useShallow } from 'zustand/react/shallow'

import { queryClient } from '~/lib/query'
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
  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

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

export function updateProfile(
  name: string,
  updater: (draft: Draft<ProfileQueryData>) => void,
) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: [
      'users',
      {
        name,
      },
    ] satisfies ProfileQueryKey,
  })

  for (const query of queries) {
    queryClient.setQueryData<ProfileQueryData>(query.queryKey, (previous) => {
      if (!previous) {
        return previous
      }

      return create(previous, (draft) => {
        updater(draft)
      })
    })
  }
}
