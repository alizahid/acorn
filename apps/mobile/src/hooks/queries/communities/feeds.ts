import { useQuery } from '@tanstack/react-query'

import { reddit } from '~/reddit/api'
import { FeedsSchema } from '~/schemas/feeds'
import { useAuth } from '~/stores/auth'
import { transformFeed } from '~/transformers/feed'
import { type Undefined } from '~/types'
import { type Feed } from '~/types/feed'

export type FeedsQueryKey = [
  'feeds',
  {
    accountId?: string
  },
]

export type FeedsQueryData = Array<Feed>

export function useFeeds() {
  const { accountId } = useAuth()

  const queryKey: FeedsQueryKey = [
    'feeds',
    {
      accountId,
    },
  ]

  const { data, isLoading, refetch } = useQuery<
    Undefined<FeedsQueryData>,
    Error,
    FeedsQueryData,
    FeedsQueryKey
  >({
    enabled: Boolean(accountId),
    networkMode: 'offlineFirst',
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
    isLoading,
    refetch,
  }
}
