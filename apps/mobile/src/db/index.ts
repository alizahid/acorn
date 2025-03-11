import { drizzle } from 'drizzle-orm/expo-sqlite'
import { openDatabaseSync } from 'expo-sqlite'

import * as schema from './schema'

const expo = openDatabaseSync('acorn.db')

const connection = drizzle(expo, {
  schema,
})

export const db = Object.assign(connection, {
  schema,
})
