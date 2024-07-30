import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { compact } from 'lodash'

import { REDDIT_URI } from '~/lib/const'
import { redditApi } from '~/lib/reddit'
import { CommentsSchema } from '~/schemas/reddit/comments'
import { useAuth } from '~/stores/auth'
import { transformComment } from '~/transformers/comment'
import { type Comment } from '~/types/comment'

type Param = string | undefined | null

type Page = {
  after: Param
  comments: Array<Comment | null>
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
        return page.after
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

        return {
          after: response.data.after,
          comments: response.data.children.map((item) =>
            transformComment(item),
          ),
        } satisfies Page
      },
      queryKey: ['comments'],
    },
  )

  return {
    comments: compact(data?.pages.flatMap((page) => page.comments) ?? []),
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  }
}
