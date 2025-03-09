import { useMutation, useQuery } from '@tanstack/react-query'
import { eq } from 'drizzle-orm'
import { useState } from 'react'

import { db } from '~/db'
import { queryClient } from '~/lib/query'
import { usePreferences } from '~/stores/preferences'
import {
  type CommunityFeedSort,
  type FeedSort,
  type SortType,
  type TopInterval,
} from '~/types/sort'

export type SortingType = 'feed' | 'community'

export type SortingQueryData<Type extends SortType> = {
  interval?: TopInterval
  sort: Type extends 'community' ? CommunityFeedSort : FeedSort
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
    rememberSorting,
    sortCommunityPosts,
    sortFeedPosts,
  } = usePreferences()

  const queryKey: SortingQueryKey<Type> = [
    'sorting',
    {
      id,
      type,
    },
  ]

  const [initial, setInitial] = useState<SortingQueryData<Type>>({
    interval: type === 'community' ? intervalCommunityPosts : intervalFeedPosts,
    sort: (type === 'community'
      ? sortCommunityPosts
      : sortFeedPosts) as SortingQueryData<Type>['sort'],
  })

  const { data } = useQuery<
    SortingQueryData<Type>,
    Error,
    SortingQueryData<Type>,
    SortingQueryKey<Type>
  >({
    placeholderData: initial,
    async queryFn() {
      const [exists] = await db
        .select()
        .from(db.schema.sorting)
        .where(eq(db.schema.sorting.communityId, id))
        .limit(1)

      if (exists) {
        return {
          interval: exists.interval ?? undefined,
          sort: exists.sort,
        } as SortingQueryData<Type>
      }

      return initial
    },
    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- go away
    queryKey,
  })

  const { mutate } = useMutation<unknown, Error, SortingQueryData<Type>>({
    async mutationFn(variables) {
      await db
        .insert(db.schema.sorting)
        .values({
          communityId: id,
          interval: variables.interval,
          sort: variables.sort,
        })
        .onConflictDoUpdate({
          set: {
            interval: variables.interval,
            sort: variables.sort,
          },
          target: db.schema.sorting.communityId,
        })
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
