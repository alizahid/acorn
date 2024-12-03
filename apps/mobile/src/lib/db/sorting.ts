import { formatISO } from 'date-fns'

import { type SortingQueryData, type SortingType } from '~/hooks/sorting'
import { usePreferences } from '~/stores/preferences'
import { type SortingRow } from '~/types/db'

import { getDatabase } from '.'

export async function getSorting<Type extends SortingType>(
  communityId: string,
  defaults?: SortingQueryData<Type>,
): Promise<SortingQueryData<Type>> {
  const { intervalCommunityPosts, rememberCommunitySort, sortCommunityPosts } =
    usePreferences.getState()

  if (!rememberCommunitySort) {
    return {
      interval: defaults?.interval ?? intervalCommunityPosts,
      sort: (defaults?.sort ??
        sortCommunityPosts) as SortingQueryData<Type>['sort'],
    }
  }

  const db = await getDatabase()

  const row = await db.getFirstAsync<Pick<SortingRow, 'sort' | 'interval'>>(
    'SELECT sort, interval FROM sorting WHERE id = $community',
    {
      $community: communityId,
    },
  )

  return {
    interval: row?.interval ?? defaults?.interval ?? intervalCommunityPosts,
    sort: (row?.sort ??
      defaults?.sort ??
      sortCommunityPosts) as SortingQueryData<Type>['sort'],
  }
}

export async function setSorting<Type extends SortingType>(
  communityId: string,
  variables: SortingQueryData<Type>,
) {
  const db = await getDatabase()

  await db.runAsync(
    'INSERT INTO sorting (community_id, sort, interval, created_at) VALUES ($community, $sort, $interval, $time) ON CONFLICT(community_id) DO UPDATE SET sort = $sort, interval = $interval',
    {
      $community: communityId,
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
