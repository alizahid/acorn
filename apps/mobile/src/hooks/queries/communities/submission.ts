import { useQuery } from '@tanstack/react-query'

import { createApi } from '~/reddit/api'

export function useSubmission(name: string) {
  const { data, error, isLoading, refetch } = useQuery({
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
