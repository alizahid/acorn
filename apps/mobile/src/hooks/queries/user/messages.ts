import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { create, type Draft } from 'mutative'

import { queryClient } from '~/lib/query'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { MessagesSchema } from '~/schemas/messages'
import { useAuth } from '~/stores/auth'
import { transformMessage } from '~/transformers/message'
import { type Message } from '~/types/message'

type Param = string | undefined | null

type Page = {
  cursor: Param
  items: Array<Message>
}

export type MessagesQueryKey = [
  'messages',
  {
    accountId?: string
  },
]

export type MessagesQueryData = InfiniteData<Page, Param>

export function useMessages() {
  const { accountId } = useAuth()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<Page, Error, MessagesQueryData, MessagesQueryKey, Param>(
    {
      enabled: Boolean(accountId),
      getNextPageParam(page) {
        return page.cursor
      },
      initialPageParam: null,
      networkMode: 'offlineFirst',
      async queryFn({ pageParam }) {
        const url = new URL('/message/messages', REDDIT_URI)

        if (pageParam) {
          url.searchParams.set('after', pageParam)
        }

        const payload = await reddit({
          url,
        })

        const response = MessagesSchema.parse(payload)

        return {
          cursor: response.data.after,
          items: response.data.children
            .filter((item) => item.kind === 't4')
            .map((item) => transformMessage(item)),
        }
      },
      queryKey: [
        'messages',
        {
          accountId,
        },
      ],
    },
  )

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    messages: data?.pages.flatMap((page) => page.items) ?? [],
    refetch,
  }
}

export function updateMessage(
  id: string,
  updater: (draft: Draft<Message>) => void,
) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['messages', {}] satisfies MessagesQueryKey,
  })

  for (const query of queries) {
    queryClient.setQueryData<MessagesQueryData>(query.queryKey, (previous) => {
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
