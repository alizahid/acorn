import { type HistoryRow } from '~/types/db'

import { getDatabase } from '.'

export async function getHistory(ids: Array<string>) {
  const db = await getDatabase()

  const rows = await db.getAllAsync<Pick<HistoryRow, 'post_id'>>(
    `SELECT post_id FROM history WHERE post_id IN (${ids.map(() => '?').join(',')})`,
    ids,
  )

  return rows.map((row) => row.post_id)
}

export async function clearHistory() {
  const db = await getDatabase()

  await db.runAsync('DELETE FROM history')
}
