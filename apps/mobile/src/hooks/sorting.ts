import { type QueryKey, useMutation, useQuery } from '@tanstack/react-query'

import { getSorting, setSorting } from '~/lib/db/sorting'
import { queryClient } from '~/lib/query'
import { usePreferences } from '~/stores/preferences'
import { type CommunityFeedSort, type TopInterval } from '~/types/sort'

type Data = {
  interval?: TopInterval
  sort: CommunityFeedSort
}

export function useSorting(id: string) {
  const { intervalCommunityPosts, rememberCommunitySort, sortCommunityPosts } =
    usePreferences()

  const queryKey: QueryKey = [
    'sorting',
    {
      id,
    },
  ]

  const { data } = useQuery<Data>({
    initialData: {
      interval: intervalCommunityPosts,
      sort: sortCommunityPosts,
    },
    async queryFn() {
      return getSorting(id)
    },
    queryKey,
  })

  const { mutate } = useMutation<unknown, Error, Data>({
    async mutationFn(variables) {
      await setSorting(id, {
        interval: variables.interval,
        sort: variables.sort,
      })
    },
    onMutate(variables) {
      if (!rememberCommunitySort) {
        return
      }

      queryClient.setQueryData<Data>(queryKey, {
        interval: variables.interval,
        sort: variables.sort,
      })
    },
  })

  return {
    sorting: data,
    update: mutate,
  }
}
