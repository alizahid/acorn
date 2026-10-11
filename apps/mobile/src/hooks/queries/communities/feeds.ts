import { type Feed } from '@acorn/reddit'
import { useQuery } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'

import { createApi } from '~/reddit/api'
import { useAuth } from '~/stores/auth'
import { type Undefined } from '~/types'

export type FeedsQueryKey = [
  'feeds',
  {
    accountId?: string
  },
]

export type FeedsQueryData = Array<Feed>

export function useFeeds() {
  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const { data, isLoading, refetch } = useQuery<
    Undefined<FeedsQueryData>,
    Error,
    FeedsQueryData,
    FeedsQueryKey
  >({
    networkMode: 'offlineFirst',
    async queryFn() {
      const reddit = await createApi()

      const { feeds } = await reddit.feeds.mine()

      return feeds
    },
    queryKey: [
      'feeds',
      {
        accountId,
      },
    ],
  })

  return {
    feeds: data ?? [],
    isLoading,
    refetch,
  }
}
