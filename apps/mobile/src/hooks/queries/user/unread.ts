import { useQuery } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'

import { createApi } from '~/reddit/api'
import { useAuth } from '~/stores/auth'

export type UnreadQueryKey = [
  'unread',
  {
    accountId?: string
  },
]

export function useUnread() {
  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const { data } = useQuery<number, Error, number, UnreadQueryKey>({
    enabled: Boolean(accountId),
    networkMode: 'offlineFirst',
    placeholderData: 0,
    async queryFn() {
      const reddit = await createApi()

      return reddit.inbox.unread()
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
