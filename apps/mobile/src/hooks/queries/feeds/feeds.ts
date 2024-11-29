import { useIsRestoring, useQuery } from '@tanstack/react-query'

import { reddit } from '~/reddit/api'
import { FeedsSchema } from '~/schemas/feeds'
import { useAuth } from '~/stores/auth'
import { transformFeed } from '~/transformers/feed'
import { type Feed } from '~/types/feed'

export type FeedsQueryKey = [
  'feeds',
  {
    accountId?: string
  },
]

export type FeedsQueryData = Array<Feed>

export function useFeeds() {
  const isRestoring = useIsRestoring()

  const { accountId } = useAuth()

  const queryKey: FeedsQueryKey = [
    'feeds',
    {
      accountId,
    },
  ]

  const {
    data,
    isLoading,
    refetch: refresh,
  } = useQuery<
    FeedsQueryData | undefined,
    Error,
    FeedsQueryData,
    FeedsQueryKey
  >({
    enabled: Boolean(accountId),
    async queryFn() {
      const payload = await reddit({
        url: '/api/multi/mine',
      })

      const response = FeedsSchema.parse(payload)

      return response.map((feed) => transformFeed(feed.data))
    },
    queryKey,
  })

  return {
    feeds: data ?? [],
    isLoading: isRestoring || isLoading,
    refetch: async () => {
      await refresh()
    },
  }
}
