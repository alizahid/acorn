import { type Profile } from '@acorn/reddit'
import { useQuery } from '@tanstack/react-query'
import { create, type Draft } from 'mutative'
import { useShallow } from 'zustand/react/shallow'

import { queryClient } from '~/lib/query'
import { createApi } from '~/reddit/api'
import { useAuth } from '~/stores/auth'
import { type Nullable } from '~/types'

export type ProfileQueryKey = [
  'users',
  {
    accountId?: string
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
    Nullable<ProfileQueryData>,
    Error,
    ProfileQueryData,
    ProfileQueryKey
  >({
    enabled: Boolean(accountId) && Boolean(name),
    async queryFn() {
      const reddit = await createApi()

      if (name === accountId) {
        return reddit.users.me()
      }

      return reddit.users.get({
        name: name!,
      })
    },
    queryKey: [
      'users',
      {
        accountId,
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
