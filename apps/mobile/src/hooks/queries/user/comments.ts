import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { create } from 'mutative'

import { queryClient } from '~/lib/query'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { CommentsSchema } from '~/schemas/comments'
import { useAuth } from '~/stores/auth'
import { transformComment } from '~/transformers/comment'
import { type Comment, type CommentReply } from '~/types/comment'

type Param = string | undefined | null

type Page = {
  comments: Array<Comment>
  cursor: Param
}

export type CommentsQueryKey = [
  'comments',
  {
    accountId?: string
    user: string
  },
]

export type CommentsQueryData = InfiniteData<Page, Param>

export function useComments(user?: string) {
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
      enabled: Boolean(accountId) && Boolean(user),
      getNextPageParam(page) {
        return page.cursor
      },
      initialPageParam: null,
      async queryFn({ pageParam }) {
        const url = new URL(`/user/${user!}/comments`, REDDIT_URI)

        url.searchParams.set('limit', '50')

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
      queryKey: [
        'comments',
        {
          accountId,
          user: user!,
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

export function updateComments(
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
