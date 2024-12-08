import { formatISO } from 'date-fns'

import { type SortingQueryData, type SortingType } from '~/hooks/sorting'
import { usePreferences } from '~/stores/preferences'
import { type SortingRow } from '~/types/db'

import { getDatabase } from '.'

export async function getSorting<Type extends SortingType>(
  type: Type,
  id: string,
): Promise<SortingQueryData<Type>> {
  const {
    intervalCommunityPosts,
    intervalFeedPosts,
    intervalUserPosts,
    sortCommunityPosts,
    sortFeedPosts,
    sortUserPosts,
  } = usePreferences.getState()

  const initial: SortingQueryData<Type> = {
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
  }

  const db = await getDatabase()

  const row = await db.getFirstAsync<Pick<SortingRow, 'sort' | 'interval'>>(
    'SELECT sort, interval FROM sorting WHERE community_id = $community',
    {
      $community: id,
    },
  )

  if (row) {
    return {
      interval: row.interval,
      sort: row.sort as SortingQueryData<Type>['sort'],
    }
  }

  return initial
}

export async function setSorting<Type extends SortingType>(
  id: string,
  variables: SortingQueryData<Type>,
) {
  const db = await getDatabase()

  await db.runAsync(
    'INSERT INTO sorting (community_id, sort, interval, created_at) VALUES ($community, $sort, $interval, $time) ON CONFLICT(community_id) DO UPDATE SET sort = $sort, interval = $interval',
    {
      $community: id,
      $interval: variables.interval ?? null,
      $sort: variables.sort,
      $time: formatISO(new Date()),
    },
  )
}

export async function clearSorting() {
  const db = await getDatabase()

  await db.runAsync('DELETE FROM sorting')
}
