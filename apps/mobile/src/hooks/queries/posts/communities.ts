import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import { REDDIT_URI } from '~/lib/const'
import { redditApi } from '~/lib/reddit'
import { CommunitiesSchema } from '~/schemas/reddit/communities'
import { useAuth } from '~/stores/auth'
import { transformCommunity } from '~/transformers/community'
import { type Community } from '~/types/community'

type Param = string | undefined | null

type Page = {
  after: Param
  communities: Array<Community>
}

export type CommunitiesQueryKey = ['communities']

export type CommunitiesQueryData = InfiniteData<Page, Param>

export function useCommunities() {
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
  } = useInfiniteQuery<
    Page,
    Error,
    CommunitiesQueryData,
    CommunitiesQueryKey,
    Param
  >({
    enabled: !expired,
    getNextPageParam(page) {
      return page.after
    },
    initialPageParam: null,
    async queryFn({ pageParam }) {
      const url = new URL('/subreddits/mine', REDDIT_URI)

      url.searchParams.set('limit', '25')

      if (pageParam) {
        url.searchParams.set('after', pageParam)
      }

      const payload = await redditApi({
        accessToken,
        url,
      })

      const response = CommunitiesSchema.parse(payload)

      return {
        after: response.data.after,
        communities: response.data.children.map((item) =>
          transformCommunity(item),
        ),
      } satisfies Page
    },
    queryKey: ['communities'],
  })

  return {
    communities: data?.pages.flatMap((page) => page.communities) ?? [],
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  }
}
