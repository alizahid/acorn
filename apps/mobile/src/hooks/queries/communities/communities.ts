import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { sortBy, uniq } from 'lodash'
import { useMemo } from 'react'

import { isUser } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { CommunitiesSchema } from '~/schemas/communities'
import { useAuth } from '~/stores/auth'
import { transformCommunity } from '~/transformers/community'
import { type Community } from '~/types/community'

type Param = string | undefined | null

type Page = {
  communities: Array<Community>
  cursor: Param
}

export type CommunitiesQueryKey = [
  'communities',
  {
    accountId?: string
  },
]

export type CommunitiesQueryData = InfiniteData<Page, Param>

export function useCommunities() {
  const { accountId } = useAuth()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<
    Page,
    Error,
    CommunitiesQueryData,
    CommunitiesQueryKey,
    Param
  >({
    enabled: Boolean(accountId),
    getNextPageParam(page) {
      return page.cursor
    },
    initialPageParam: null,
    async queryFn({ pageParam }) {
      const url = new URL('/subreddits/mine', REDDIT_URI)

      url.searchParams.set('limit', '50')

      if (pageParam) {
        url.searchParams.set('after', pageParam)
      }

      const payload = await reddit({
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
    queryKey: [
      'communities',
      {
        accountId,
      },
    ],
  })

  const communities = useMemo(
    () =>
      getCommunities(
        data?.pages.flatMap((page) => page.communities) ?? [],
        false,
      ),
    [data?.pages],
  )

  const users = useMemo(
    () =>
      getCommunities(
        data?.pages.flatMap((page) => page.communities) ?? [],
        true,
      ),
    [data?.pages],
  )

  return {
    communities,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
    users,
  }
}

function getCommunities(communities: Array<Community>, filter: boolean) {
  return uniq(
    sortBy(communities, (community) => community.name.toLowerCase())
      .filter((community) => isUser(community.name) === filter)
      .flatMap((community) => [
        community.name.slice(0, 1).toLowerCase(),
        community,
      ]),
  )
}
