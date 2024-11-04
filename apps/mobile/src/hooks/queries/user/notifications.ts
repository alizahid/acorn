import {
  type InfiniteData,
  useInfiniteQuery,
  useIsRestoring,
} from '@tanstack/react-query'
import { compact } from 'lodash'
import { create, type Draft } from 'mutative'

import { queryClient, resetInfiniteQuery } from '~/lib/query'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { NotificationsSchema } from '~/schemas/notifications'
import { useAuth } from '~/stores/auth'
import { transformNotification } from '~/transformers/notification'
import { type Notification } from '~/types/notification'

type Param = string | undefined | null

type Page = {
  cursor: Param
  notifications: Array<Notification>
}

export type NotificationsQueryKey = [
  'notifications',
  {
    accountId?: string
  },
]

export type NotificationsQueryData = InfiniteData<Page, Param>

export function useNotifications() {
  const isRestoring = useIsRestoring()

  const { accountId } = useAuth()

  const queryKey: NotificationsQueryKey = [
    'notifications',
    {
      accountId,
    },
  ]

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isStale,
    refetch: refresh,
  } = useInfiniteQuery<
    Page,
    Error,
    NotificationsQueryData,
    NotificationsQueryKey,
    Param
  >({
    enabled: Boolean(accountId),
    initialPageParam: null,
    async queryFn({ pageParam }) {
      const url = new URL('/message/inbox', REDDIT_URI)

      if (pageParam) {
        url.searchParams.set('after', pageParam)
      }

      const payload = await reddit({
        url,
      })

      const response = NotificationsSchema.parse(payload)

      const notifications = response.data.children.filter(
        (item) => item.kind === 't1',
      )

      return {
        cursor: response.data.after,
        notifications: compact(
          notifications.map((item) => transformNotification(item)),
        ),
      }
    },
    staleTime: 60 * 1_000,
    // eslint-disable-next-line sort-keys-fix/sort-keys-fix -- go away
    getNextPageParam(page) {
      return page.cursor
    },
    queryKey,
  })

  const notifications = data?.pages.flatMap((page) => page.notifications) ?? []

  const unread = notifications.filter((notification) => notification.new).length

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isRestoring || isLoading,
    isRefreshing: isStale && isFetching && !isLoading,
    notifications,
    refetch: async () => {
      resetInfiniteQuery(queryKey)

      await refresh()
    },
    unread,
  }
}

export function updateNotification(
  id: string,
  updater: (draft: Draft<Notification>) => void,
) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['notifications'],
  })

  for (const query of queries) {
    queryClient.setQueryData<NotificationsQueryData>(
      query.queryKey,
      (previous) => {
        if (!previous) {
          return previous
        }

        return create(previous, (draft) => {
          let found = false

          for (const page of draft.pages) {
            if (found) {
              break
            }

            for (const notification of page.notifications) {
              if (notification.id === id) {
                updater(notification)

                found = true

                break
              }
            }
          }
        })
      },
    )
  }
}

export function updateNotifications(accountId?: string) {
  queryClient.setQueryData<NotificationsQueryData, NotificationsQueryKey>(
    [
      'notifications',
      {
        accountId,
      },
    ],
    (previous) => {
      if (!previous) {
        return previous
      }

      return create(previous, (draft) => {
        for (const page of draft.pages) {
          for (const notification of page.notifications) {
            notification.new = false
          }
        }
      })
    },
  )
}
