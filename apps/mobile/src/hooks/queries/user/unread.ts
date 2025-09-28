import { useQuery } from '@tanstack/react-query'

import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { type NotificationsSchema } from '~/schemas/notifications'
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
    networkMode: 'offlineFirst',
    placeholderData: 0,
    async queryFn() {
      const url = new URL('/message/unread', REDDIT_URI)

      url.searchParams.set('max_replies', '300')

      const payload = await reddit<NotificationsSchema>({
        url,
      })

      return payload?.data.children.length ?? 0
    },
    queryKey: [
      'unread',
      {
        accountId,
      },
    ],
    staleTime: 1000 * 60,
  })

  const unread = Math.min(Math.max(data ?? 0, 0), 99)

  return {
    unread: unread ? String(unread) : undefined,
  }
}
