import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { sortBy } from 'lodash'

import { isUser, REDDIT_URI, redditApi } from '~/lib/reddit'
import { CommunitiesSchema } from '~/schemas/reddit/communities'
import { useAuth } from '~/stores/auth'
import { transformCommunity } from '~/transformers/community'
import { type Community } from '~/types/community'

type Param = string | undefined | null

type Page = {
  communities: Array<Community>
  cursor: Param
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
      return page.cursor
    },
    initialPageParam: null,
    async queryFn({ pageParam }) {
      const url = new URL('/subreddits/mine', REDDIT_URI)

      url.searchParams.set('limit', '100')

      if (pageParam) {
        url.searchParams.set('after', pageParam)
      }

      const payload = await redditApi({
        accessToken,
        url,
      })

      const response = CommunitiesSchema.parse(payload)

      return {
        communities: response.data.children.map((item) =>
          transformCommunity(item.data),
        ),
        cursor: response.data.after,
      }
    },
    queryKey: ['communities'],
  })

  const communities = sortBy(
    data?.pages.flatMap((page) => page.communities) ?? [],
    (item) => item.name.toLowerCase(),
  )

  return {
    communities: communities.filter((community) => !isUser(community.name)),
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
    users: communities.filter((community) => isUser(community.name)),
  }
}
