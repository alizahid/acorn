import { type Notification } from '@acorn/reddit'
import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { create, type Draft } from 'mutative'
import { useShallow } from 'zustand/react/shallow'

import { queryClient } from '~/lib/query'
import { createApi } from '~/reddit/api'
import { useAuth } from '~/stores/auth'

type Param = string | undefined | null

type Page = {
  cursor: Param
  items: Array<Notification>
}

export type NotificationsQueryKey = [
  'notifications',
  {
    accountId?: string
  },
]

export type NotificationsQueryData = InfiniteData<Page, Param>

export function useNotifications() {
  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<
    Page,
    Error,
    NotificationsQueryData,
    NotificationsQueryKey,
    Param
  >({
    enabled: Boolean(accountId),
    getNextPageParam(page) {
      return page.cursor
    },
    initialPageParam: null,
    networkMode: 'offlineFirst',
    async queryFn({ pageParam }) {
      const reddit = await createApi()

      const { cursor, notifications } = await reddit.inbox.notifications({
        after: pageParam ?? undefined,
      })

      return {
        cursor,
        items: notifications,
      }
    },
    queryKey: [
      'notifications',
      {
        accountId,
      },
    ],
  })

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    notifications: data?.pages.flatMap((page) => page.items) ?? [],
    refetch,
  }
}

export function updateNotification(
  id: string,
  updater: (draft: Draft<Notification>) => void,
) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['notifications', {}] satisfies NotificationsQueryKey,
  })

  for (const query of queries) {
    queryClient.setQueryData<NotificationsQueryData>(
      query.queryKey,
      (previous) => {
        if (!previous) {
          return previous
        }

        return create(previous, (draft) => {
          loop: for (const page of draft.pages) {
            for (const item of page.items) {
              if (item.id === id) {
                updater(item)

                break loop
              }
            }
          }
        })
      },
    )
  }
}
