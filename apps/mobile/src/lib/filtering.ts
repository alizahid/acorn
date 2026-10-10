import { type Community, type Post, type User } from '@acorn/reddit'
import { eq, inArray } from 'drizzle-orm'

import { db } from '~/db'
import { addPrefix, removePrefix } from '~/lib/reddit'
import { usePreferences } from '~/stores/preferences'

export async function filterPosts(
  posts: Array<Post>,
  apply = true,
): Promise<Array<Post>> {
  const { hideSeen } = usePreferences.getState()

  // history from before gql-fed holds bare ids
  const seen = await db
    .select()
    .from(db.schema.history)
    .where(
      inArray(
        db.schema.history.postId,
        posts.flatMap((post) => [post.id, removePrefix(post.id)]),
      ),
    )
    .then((rows) => rows.map((row) => addPrefix(row.postId, 'link')))

  const items = posts.map((post) => ({
    ...post,
    seen: seen.includes(post.id),
  }))

  if (!apply) {
    return items
  }

  const filters = await db
    .select()
    .from(db.schema.filters)
    .where(inArray(db.schema.filters.type, ['keyword', 'community', 'user']))

  return items.filter((post) => {
    if (hideSeen && post.seen) {
      return false
    }

    return !filters.some(
      (filter) =>
        (filter.type === 'keyword' &&
          post.title.toLowerCase().includes(filter.value.toLowerCase())) ||
        (filter.type === 'community' && filter.value === post.community.name) ||
        (filter.type === 'user' && filter.value === post.user.name),
    )
  })
}

export async function filterCommunities(
  communities: Array<Community>,
): Promise<Array<Community>> {
  const filters = await db
    .select()
    .from(db.schema.filters)
    .where(eq(db.schema.filters.type, 'community'))

  return communities.filter(
    (community) =>
      !filters.some(
        (filter) => filter.value.toLowerCase() === community.name.toLowerCase(),
      ),
  )
}

export async function filterUsers(users: Array<User>): Promise<Array<User>> {
  const filters = await db
    .select()
    .from(db.schema.filters)
    .where(eq(db.schema.filters.type, 'user'))

  return users.filter(
    (user) =>
      !filters.some(
        (filter) => filter.value.toLowerCase() === user.name.toLowerCase(),
      ),
  )
}
