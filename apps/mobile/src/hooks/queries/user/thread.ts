import { useQuery } from '@tanstack/react-query'
import { formatISO, parseISO } from 'date-fns'
import { groupBy, orderBy } from 'lodash'
import { useMemo } from 'react'

import { queryClient } from '~/lib/query'
import { useAuth } from '~/stores/auth'

import { type MessagesQueryData, type MessagesQueryKey } from './messages'

export function useThread(id: string) {
  const { accountId } = useAuth()

  const { data, refetch } = useQuery({
    enabled: Boolean(accountId),
    networkMode: 'offlineFirst',
    queryFn() {
      const messages = queryClient.getQueryData<
        MessagesQueryData,
        MessagesQueryKey
      >([
        'messages',
        {
          accountId,
        },
      ])

      if (!messages) {
        return []
      }

      for (const page of messages.pages) {
        for (const item of page.items) {
          if (item.id === id) {
            return [item, ...(item.replies ?? [])]
          }
        }
      }

      return []
    },
    queryKey: [
      'thread',
      {
        accountId,
        id,
      },
    ],
  })

  const messages = useMemo(() => {
    const groups = groupBy(data ?? [], (item) =>
      formatISO(item.createdAt, {
        representation: 'date',
      }),
    )

    return Object.entries(groups).flatMap(([date, items]) => [
      parseISO(date),
      ...orderBy(items, 'createdAt', 'asc'),
    ])
  }, [data])

  return {
    messages,
    refetch,
  }
}
