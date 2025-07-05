import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

import { CommunityFeedSort, FeedSort, TopInterval } from '~/types/sort'

export const history = sqliteTable('history', {
  postId: text().notNull().primaryKey(),
})

export type History = typeof history.$inferSelect

export const collapsed = sqliteTable('collapsed', {
  commentId: text().notNull().primaryKey(),
  postId: text().notNull(),
})

export type Collapsed = typeof collapsed.$inferSelect

// biome-ignore assist/source/useSortedKeys: go away
export const sorting = sqliteTable('sorting', {
  communityId: text().notNull().primaryKey(),
  sort: text({
    enum: [...CommunityFeedSort, ...FeedSort],
  }).notNull(),
  interval: text({
    enum: TopInterval,
  }),
})

export type Sorting = typeof sorting.$inferSelect

export const filters = sqliteTable('filters', {
  id: text().notNull().primaryKey(),
  type: text({
    enum: ['keyword', 'community', 'user', 'post'],
  }).notNull(),
  value: text().notNull(),
})

export type Filter = typeof filters.$inferSelect
