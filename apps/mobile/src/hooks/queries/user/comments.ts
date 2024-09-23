import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { create } from 'mutative'

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
    username: string
  },
]

export type CommentsQueryData = InfiniteData<Page, Param>

export type UserCommentsProps = {
  interval?: TopInterval
  sort: CommentSort
  username: string
}

export function useUserComments({
  interval,
  sort,
  username,
}: UserCommentsProps) {
  const { accountId } = useAuth()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<Page, Error, CommentsQueryData, CommentsQueryKey, Param>(
    {
      enabled: Boolean(accountId) && Boolean(username),
      initialPageParam: null,
      async queryFn({ pageParam }) {
        const url = new URL(`/user/${username}/comments`, REDDIT_URI)

        url.searchParams.set('limit', '50')
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
          username,
        },
      ],
    },
  )

  return {
    comments: data?.pages.flatMap((page) => page.comments) ?? [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  }
}

export function updateUserComment(
  id: string,
  updater: (draft: CommentReply) => void,
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
