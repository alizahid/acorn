import { formatISO } from 'date-fns'

import { type CollapsedRow } from '~/types/db'

import { getDatabase } from '.'

export async function getCollapsedForPost(id: string) {
  const db = await getDatabase()

  const rows = await db.getAllAsync<Pick<CollapsedRow, 'comment_id'>>(
    `SELECT comment_id FROM collapsed WHERE post_id = $post`,
    {
      $post: id,
    },
  )

  return rows.map((row) => row.comment_id)
}

export async function collapseComment(id: string, postId: string) {
  const db = await getDatabase()

  const exists = await db.getFirstAsync<Pick<CollapsedRow, 'comment_id'>>(
    'SELECT comment_id FROM collapsed WHERE comment_id = $comment AND post_id = $post LIMIT 1',
    {
      $comment: id,
      $post: postId,
    },
  )

  if (exists) {
    await db.runAsync(
      'DELETE FROM collapsed WHERE comment_id = $comment AND post_id = $post',
      {
        $comment: id,
        $post: postId,
      },
    )

    return
  }

  await db.runAsync(
    'INSERT INTO collapsed (comment_id, post_id, collapsed_at) VALUES ($comment, $post, $time) ON CONFLICT (comment_id) DO NOTHING',
    {
      $comment: id,
      $post: postId,
      $time: formatISO(new Date()),
    },
  )
}

export async function clearCollapsed() {
  const db = await getDatabase()

  await db.runAsync('DELETE FROM collapsed')
}
