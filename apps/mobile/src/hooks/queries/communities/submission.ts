import { useQuery } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'

import { createApi } from '~/reddit/api'
import { useAuth } from '~/stores/auth'

export function useSubmission(name: string) {
  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const { data, error, isLoading, refetch } = useQuery({
    enabled: Boolean(accountId),
    networkMode: 'offlineFirst',
    async queryFn() {
      const reddit = await createApi()

      return reddit.communities.submission({
        name,
      })
    },
    queryKey: [
      'submission',
      {
        accountId,
        name,
      },
    ],
    retry: false,
  })

  return {
    error,
    isLoading,
    refetch,
    submission: data,
  }
}
