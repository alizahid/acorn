import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { create, type Draft } from 'mutative'

import { queryClient } from '~/lib/query'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { NotificationsSchema } from '~/schemas/notifications'
import { useAuth } from '~/stores/auth'
import { transformNotification } from '~/transformers/notification'
import { type Notification } from '~/types/notification'

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
  const { accountId } = useAuth()

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
      const url = new URL('/message/inbox', REDDIT_URI)

      if (pageParam) {
        url.searchParams.set('after', pageParam)
      }

      const payload = await reddit({
        url,
      })

      const response = NotificationsSchema.parse(payload)

      return {
        cursor: response.data.after,
        items: response.data.children
          .filter((item) => item.kind === 't1')
          .map((item) => transformNotification(item)),
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
