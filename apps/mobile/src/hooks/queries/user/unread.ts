import { useQuery } from '@tanstack/react-query'

import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { InboxSchema } from '~/schemas/inbox'
import { useAuth } from '~/stores/auth'

export type UnreadQueryKey = [
  'unread',
  {
    accountId?: string
  },
]

export function useUnread() {
  const { accountId } = useAuth()

  const { data } = useQuery<number, Error, number, UnreadQueryKey>({
    enabled: Boolean(accountId),
    placeholderData: 0,
    async queryFn() {
      const url = new URL('/message/unread', REDDIT_URI)

      url.searchParams.set('max_replies', '300')

      const payload = await reddit({
        url,
      })

      const response = InboxSchema.parse(payload)

      return response.data.children.length
    },
    queryKey: [
      'unread',
      {
        accountId,
      },
    ],
    staleTime: 1_000 * 60,
  })

  return {
    unread: Math.min(Math.max(data ?? 0, 0), 99),
  }
}
