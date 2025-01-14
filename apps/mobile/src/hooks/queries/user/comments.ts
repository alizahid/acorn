import {
  type InfiniteData,
  useInfiniteQuery,
  useIsRestoring,
} from '@tanstack/react-query'
import fuzzysort from 'fuzzysort'
import { create, type Draft } from 'mutative'
import { useMemo } from 'react'

import { queryClient } from '~/lib/query'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { CommentsSchema } from '~/schemas/comments'
import { useAuth } from '~/stores/auth'
import { transformComment } from '~/transformers/comment'
import { type Comment, type CommentReply } from '~/types/comment'
import { type CommentSort, type TopInterval } from '~/types/sort'

type Param = string | undefined | null

type Page = {
  comments: Array<Comment>
  cursor: Param
}

export type CommentsQueryKey = [
  'comments',
  {
    accountId?: string
    interval?: TopInterval
    sort: CommentSort
    user: string
  },
]

export type CommentsQueryData = InfiniteData<Page, Param>

export type CommentsProps = {
  interval?: TopInterval
  query?: string
  sort: CommentSort
  user: string
}

export function useComments({ interval, query, sort, user }: CommentsProps) {
  const isRestoring = useIsRestoring()

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
  } = useInfiniteQuery<Page, Error, CommentsQueryData, CommentsQueryKey, Param>(
    {
      enabled: Boolean(accountId),
      initialPageParam: null,
      async queryFn({ pageParam }) {
        const url = new URL(`/user/${user}/comments`, REDDIT_URI)

        url.searchParams.set('limit', '100')
        url.searchParams.set('sort', sort)

        if (sort === 'top' && interval) {
          url.searchParams.set('t', interval)
        }

        if (pageParam) {
          url.searchParams.set('after', pageParam)
        }

        const payload = await reddit({
          url,
        })

        const response = CommentsSchema.parse(payload)

        const comments = response.data.children.filter(
          (item) => item.kind === 't1',
        )

        return {
          comments: comments.map((item) => transformComment(item)),
          cursor: response.data.after,
        }
      },
      // eslint-disable-next-line sort-keys-fix/sort-keys-fix -- go away
      getNextPageParam(page) {
        return page.cursor
      },
      queryKey: [
        'comments',
        {
          accountId,
          interval,
          sort,
          user,
        },
      ],
    },
  )

  const comments = useMemo(() => {
    const items = data?.pages.flatMap((page) => page.comments) ?? []

    if (query?.length) {
      const results = fuzzysort.go(query, items, {
        key: 'data.body',
      })

      return results.map((result) => result.obj)
    }

    return items
  }, [data?.pages, query])

  return {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isRestoring || isLoading,
    isRefreshing: isStale && isFetching && !isLoading,
    refetch,
  }
}

export function updateUserComment(
  id: string,
  updater: (draft: Draft<CommentReply>) => void,
) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['comments'],
  })

  for (const query of queries) {
    queryClient.setQueryData<CommentsQueryData>(query.queryKey, (previous) => {
      if (!previous) {
        return previous
      }

      return create(previous, (draft) => {
        let found = false

        for (const page of draft.pages) {
          if (found) {
            break
          }

          for (const comment of page.comments) {
            if (comment.data.id === id && comment.type === 'reply') {
              updater(comment.data)

              found = true

              break
            }
          }
        }
      })
    })
  }
}
