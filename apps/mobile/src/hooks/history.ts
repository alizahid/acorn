import { formatISO } from 'date-fns'
import { without } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'

import { getDatabase } from '~/lib/db'
import { type HistoryRow } from '~/types/db'

export function useHistory(ids: Array<string> = []) {
  const checked = useRef<Array<string>>([])

  const [seen, setSeen] = useState<Array<string>>([])

  useEffect(() => {
    if (ids.length === 0) {
      return
    }

    const left = without(ids, ...checked.current)

    if (left.length === 0) {
      return
    }

    checked.current = ids

    void getHistory(ids)
      .then((next) => {
        setSeen(next)
      })
      .catch(() => {
        setSeen([])
      })
  }, [ids])

  const addPost = useCallback(async (id: string) => {
    const db = await getDatabase()

    await db.runAsync(
      'INSERT INTO history (post_id, seen_at) VALUES ($post, $time) ON CONFLICT (post_id) DO NOTHING',
      {
        $post: id,
        $time: formatISO(new Date()),
      },
    )
  }, [])

  return {
    addPost,
    seen,
  }
}

export async function getHistory(ids: Array<string>) {
  const db = await getDatabase()

  const rows = await db.getAllAsync<Pick<HistoryRow, 'post_id'>>(
    `SELECT post_id FROM history WHERE post_id IN (${ids.map(() => '?').join(',')})`,
    ids,
  )

  return rows.map((row) => row.post_id)
}
