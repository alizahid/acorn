import { formatISO } from 'date-fns'

import { type HiddenMap, type HiddenRow } from '~/types/db'

import { getDatabase } from '.'

export async function getHidden(): Promise<HiddenMap> {
  const db = await getDatabase()

  const rows = await db.getAllAsync<Pick<HiddenRow, 'id' | 'type'>>(
    "SELECT id, type FROM hidden WHERE type IN ('community', 'user')",
  )

  return {
    communities: rows
      .filter((row) => row.type === 'community')
      .map((row) => row.id),
    users: rows.filter((row) => row.type === 'user').map((row) => row.id),
  }
}

export async function addHidden(id: string, type: HiddenRow['type']) {
  const db = await getDatabase()

  await db.runAsync(
    'INSERT INTO hidden (id, type, hidden_at) VALUES ($id, $type, $time) ON CONFLICT (id) DO NOTHING',
    {
      $id: id,
      $time: formatISO(new Date()),
      $type: type,
    },
  )
}

export async function removeHidden(id: string) {
  const db = await getDatabase()

  await db.runAsync('DELETE FROM hidden WHERE id = $id', {
    $id: id,
  })
}

export async function clearHidden() {
  const db = await getDatabase()

  await db.runAsync('DELETE FROM hidden')
}
