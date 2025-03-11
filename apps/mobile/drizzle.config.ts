import { type Config } from 'drizzle-kit'

export default {
  dialect: 'sqlite',
  driver: 'expo',
  out: './src/drizzle',
  schema: './src/db/schema.ts',
} satisfies Config
