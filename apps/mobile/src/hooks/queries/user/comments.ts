import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import { REDDIT_URI, redditApi } from '~/lib/reddit'
import { CommentsSchema } from '~/schemas/reddit/comments'
import { useAuth } from '~/stores/auth'
import { transformComment } from '~/transformers/comment'
import { type Comment } from '~/types/comment'

type Param = string | undefined | null

type Page = {
  comments: Array<Comment>
  cursor: Param
}

export type CommentsQueryKey = ['comments']

export type CommentsQueryData = InfiniteData<Page, Param>

export function useComments(user?: string) {
  const { accessToken, expired } = useAuth()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useInfiniteQuery<Page, Error, CommentsQueryData, CommentsQueryKey, Param>(
    {
      enabled: !expired || Boolean(user),
      getNextPageParam(page) {
        return page.cursor
      },
      initialPageParam: null,
      async queryFn({ pageParam }) {
        const url = new URL(`/user/${user!}/comments`, REDDIT_URI)

        url.searchParams.set('limit', '25')

        if (pageParam) {
          url.searchParams.set('after', pageParam)
        }

        const payload = await redditApi({
          accessToken,
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
      queryKey: ['comments'],
    },
  )

  return {
    comments: data?.pages.flatMap((page) => page.comments) ?? [],
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  }
}
