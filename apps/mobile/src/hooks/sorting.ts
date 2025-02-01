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

export type SortingQueryKey<Type extends SortType> = [
  'sorting',
  {
    id: string
    type: Type
  },
]

export function useSorting<Type extends SortingType>(type: Type, id: string) {
  const {
    intervalCommunityPosts,
    intervalFeedPosts,
    intervalUserPosts,
    rememberSorting,
    sortCommunityPosts,
    sortFeedPosts,
    sortUserPosts,
  } = usePreferences()

  const queryKey: SortingQueryKey<Type> = [
    'sorting',
    {
      id,
      type,
    },
  ]

  const [initial, setInitial] = useState<SortingQueryData<Type>>({
    interval:
      type === 'community'
        ? intervalCommunityPosts
        : type === 'user'
          ? intervalUserPosts
          : intervalFeedPosts,
    sort: (type === 'community'
      ? sortCommunityPosts
      : type === 'user'
        ? sortUserPosts
        : sortFeedPosts) as SortingQueryData<Type>['sort'],
  })

  const { data } = useQuery<SortingQueryData<Type>>({
    placeholderData: initial,
    queryFn() {
      return getSorting(type, id)
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

  return {
    sorting: rememberSorting ? data! : initial,
    update: mutate,
  }
}
