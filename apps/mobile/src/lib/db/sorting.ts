import { formatISO } from 'date-fns'

import { usePreferences } from '~/stores/preferences'
import { type SortingRow } from '~/types/db'

import { getDatabase } from '.'

export async function getSorting(communityId: string) {
  const { intervalCommunityPosts, rememberCommunitySort, sortCommunityPosts } =
    usePreferences.getState()

  if (!rememberCommunitySort) {
    return {
      interval: intervalCommunityPosts,
      sort: sortCommunityPosts,
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
    interval: row?.interval ?? intervalCommunityPosts,
    sort: row?.sort ?? sortCommunityPosts,
  }
}

export async function setSorting(
  id: string,
  { interval, sort }: Pick<SortingRow, 'sort' | 'interval'>,
) {
  const db = await getDatabase()

  await db.runAsync(
    'INSERT INTO sorting (community_id, sort, interval, created_at) VALUES ($community, $sort, $interval, $time) ON CONFLICT(community_id) DO UPDATE SET sort = $sort, interval = $interval',
    {
      $community: id,
      $interval: interval ?? null,
      $sort: sort,
      $time: formatISO(new Date()),
    },
  )
}

export async function clearSorting() {
  const db = await getDatabase()

  await db.runAsync('DELETE FROM sorting')
}
