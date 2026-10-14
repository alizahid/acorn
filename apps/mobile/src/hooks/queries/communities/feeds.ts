import { type Feed, type Reddit } from '@acorn/reddit'
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
    enabled: Boolean(accountId),
    networkMode: 'offlineFirst',
    async queryFn() {
      const reddit = await createApi()

      return fetchFeeds(reddit)
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

async function fetchFeeds(
  reddit: Reddit,
  after?: string,
): Promise<FeedsQueryData> {
  const { feeds, cursor } = await reddit.feeds.mine({
    after,
  })

  if (cursor) {
    return [...feeds, ...(await fetchFeeds(reddit, cursor))]
  }

  return feeds
}
