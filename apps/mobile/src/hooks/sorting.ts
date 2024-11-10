import { type QueryKey, useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

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

  const [initial, setInitial] = useState<Data>({
    interval: intervalCommunityPosts,
    sort: sortCommunityPosts,
  })

  const queryKey: QueryKey = [
    'sorting',
    {
      id,
    },
  ]

  const { data } = useQuery<Data>({
    initialData: initial,
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
      setInitial(variables)

      queryClient.setQueryData<Data>(queryKey, variables)
    },
  })

  const sorting = rememberCommunitySort ? data : initial

  return {
    sorting,
    update: mutate,
  }
}
