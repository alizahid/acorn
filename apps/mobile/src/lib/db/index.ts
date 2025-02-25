import * as SQLite from 'expo-sqlite'
import { type SQLiteDatabase } from 'expo-sqlite'

export const databaseName = 'acorn.sql'

export async function onInit(db: SQLiteDatabase) {
  const latest = 5

  const pragma = await db.getFirstAsync<{
    user_version: number
  }>('PRAGMA user_version')

  let current = pragma?.user_version ?? 0

  if (current >= latest) {
    return
  }

  if (current === 0) {
    await db.execAsync(`PRAGMA journal_mode = 'WAL'`)

    await db.execAsync(
      `CREATE TABLE history (post_id TEXT NOT NULL PRIMARY KEY, seen_at TEXT NOT NULL)`,
    )

    current = 1
  }

  if (current === 1) {
    await db.execAsync(
      `CREATE TABLE collapsed (comment_id TEXT NOT NULL PRIMARY KEY, post_id TEXT NOT NULL, collapsed_at TEXT NOT NULL)`,
    )

    current = 2
  }

  if (current === 2) {
    await db.execAsync(
      `CREATE TABLE hidden (id TEXT NOT NULL PRIMARY KEY, type TEXT NOT NULL, hidden_at TEXT NOT NULL)`,
    )

    current = 3
  }

  if (current === 3) {
    await db.execAsync(
      `CREATE TABLE sorting (community_id TEXT NOT NULL PRIMARY KEY, sort TEXT NOT NULL, interval TEXT, created_at TEXT NOT NULL)`,
    )

    current = 4
  }

  if (current === 4) {
    await db.execAsync(`PRAGMA journal_mode = 'TRUNCATE'`)

    current = 5
  }

  await db.execAsync(`PRAGMA user_version = ${latest}`)
}

export async function getDatabase() {
  return SQLite.openDatabaseAsync(databaseName)
}
