import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { getSorting, setSorting } from '~/lib/db/sorting'
import { queryClient } from '~/lib/query'
import { usePreferences } from '~/stores/preferences'
import {
  type CommunityFeedSort,
  type FeedSort,
  type SortType,
  type TopInterval,
  type UserFeedSort,
} from '~/types/sort'

export type SortingType = 'feed' | 'community' | 'user'

export type SortingQueryData<Type extends SortType> = {
  interval?: TopInterval
  sort: Type extends 'community'
    ? CommunityFeedSort
    : Type extends 'user'
      ? UserFeedSort
      : FeedSort
}

export type SortingQueryKey<Type extends SortingType> = [
  'sorting',
  {
    defaults?: SortingQueryData<Type>
    id: string
  },
]

export function useSorting<Type extends SortingType>(
  id: string,
  defaults?: SortingQueryData<Type>,
) {
  const { intervalCommunityPosts, rememberCommunitySort, sortCommunityPosts } =
    usePreferences()

  const [initial, setInitial] = useState<SortingQueryData<Type>>({
    interval: defaults?.interval ?? intervalCommunityPosts,
    sort: (defaults?.sort ??
      sortCommunityPosts) as SortingQueryData<Type>['sort'],
  })

  const queryKey: SortingQueryKey<Type> = [
    'sorting',
    {
      defaults,
      id,
    },
  ]

  const { data } = useQuery<
    SortingQueryData<Type>,
    Error,
    SortingQueryData<Type>
  >({
    initialData: initial,
    async queryFn() {
      return getSorting<Type>(id, defaults)
    },
    queryKey,
  })

  const { mutate } = useMutation<unknown, Error, SortingQueryData<Type>>({
    async mutationFn(variables) {
      await setSorting(id, variables)
    },
    onMutate(variables) {
      setInitial(variables)

      queryClient.setQueryData<SortingQueryData<Type>>(queryKey, variables)
    },
  })

  const sorting = rememberCommunitySort ? data : initial

  return {
    sorting,
    update: mutate,
  }
}
