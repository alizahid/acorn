import * as SQLite from 'expo-sqlite'
import { type SQLiteDatabase } from 'expo-sqlite'

export const databaseName = 'acorn.sql'

export async function onInit(db: SQLiteDatabase) {
  const latest = 1

  const pragma = await db.getFirstAsync<{
    user_version: number
  }>('PRAGMA user_version')

  let current = pragma?.user_version ?? 0

  if (current >= latest) {
    return
  }

  if (current === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';

CREATE TABLE history (post_id TEXT NOT NULL PRIMARY KEY, seen_at TEXT NOT NULL);
`)

    current = 1
  }

  await db.execAsync(`PRAGMA user_version = ${latest}`)
}

export async function getDatabase() {
  return SQLite.openDatabaseAsync(databaseName)
}
