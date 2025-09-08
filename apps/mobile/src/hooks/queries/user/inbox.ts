import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { create, type Draft } from 'mutative'

import { queryClient } from '~/lib/query'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { InboxSchema } from '~/schemas/inbox'
import { useAuth } from '~/stores/auth'
import { transformInboxItem } from '~/transformers/inbox'
import { type Notification } from '~/types/inbox'

type Param = string | undefined | null

type Page = {
  cursor: Param
  items: Array<Notification>
}

export type InboxQueryKey = [
  'inbox',
  {
    accountId?: string
  },
]

export type InboxQueryData = InfiniteData<Page, Param>

export function useInbox() {
  const { accountId } = useAuth()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isStale,
    refetch,
  } = useInfiniteQuery<Page, Error, InboxQueryData, InboxQueryKey, Param>({
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

      const response = InboxSchema.parse(payload)

      return {
        cursor: response.data.after,
        items: response.data.children.map((item) => transformInboxItem(item)),
      }
    },
    queryKey: [
      'inbox',
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
    isRefreshing: isStale && isFetching && !isLoading,
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
    queryKey: ['inbox', {}] satisfies InboxQueryKey,
  })

  for (const query of queries) {
    queryClient.setQueryData<InboxQueryData>(query.queryKey, (previous) => {
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
    })
  }
}

export function updateInbox(
  updater: (draft: Draft<Notification>) => void,
  accountId?: string,
) {
  queryClient.setQueryData<InboxQueryData, InboxQueryKey>(
    [
      'inbox',
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
          for (const item of page.items) {
            updater(item)
          }
        }
      })
    },
  )
}
