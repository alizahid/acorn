import { type Profile } from '@acorn/reddit'
import { useQuery } from '@tanstack/react-query'
import { create, type Draft } from 'mutative'
import { useShallow } from 'zustand/react/shallow'

import { queryClient } from '~/lib/query'
import { createApi } from '~/reddit/api'
import { useAuth } from '~/stores/auth'
import { type Undefined } from '~/types'

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
      const reddit = await createApi()

      // only GetAccount has the signed-in user's age when their profile is null
      const profile =
        name === accountId
          ? await reddit.users.me()
          : await reddit.users.get({
              name: name!,
            })

      if (!profile) {
        throw new Error('User not found')
      }

      return profile
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
