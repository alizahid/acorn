import { eq, inArray } from 'drizzle-orm'
import { compact } from 'lodash'

import { db } from '~/db'
import { type CommunitiesSchema } from '~/schemas/communities'
import { type PostsSchema, type SavedPostsSchema } from '~/schemas/posts'
import { type UsersSchema } from '~/schemas/users'
import { usePreferences } from '~/stores/preferences'
import { transformComment } from '~/transformers/comment'
import { transformCommunity } from '~/transformers/community'
import { transformPost } from '~/transformers/post'
import { transformUser } from '~/transformers/user'
import { type Comment } from '~/types/comment'
import { type Community } from '~/types/community'
import { type Post } from '~/types/post'
import { type User } from '~/types/user'

export async function filterPosts(
  { data }: PostsSchema | SavedPostsSchema,
  apply = true,
): Promise<Array<Post | Comment>> {
  const { hideSeen } = usePreferences.getState()

  const posts = data.children.filter((post) => post.kind === 't3')

  const seen = await db
    .select()
    .from(db.schema.history)
    .where(
      inArray(
        db.schema.history.postId,
        posts.map((post) => post.data.id),
      ),
    )
    .then((items) => items.map((item) => item.postId))

  const filters = await db
    .select()
    .from(db.schema.filters)
    .where(inArray(db.schema.filters.type, ['keyword', 'community', 'user']))

  return data.children
    .filter((item) => {
      if (item.kind === 't1') {
        return true
      }

      if (hideSeen && seen.includes(item.data.id)) {
        return false
      }

      if (!apply) {
        return true
      }

      const keyword = filters
        .filter((filter) => filter.type === 'keyword')
        .some((filter) =>
          item.data.title.toLowerCase().includes(filter.value.toLowerCase()),
        )

      if (keyword) {
        return false
      }

      const community = filters.find(
        (filter) =>
          filter.type === 'community' &&
          filter.value.toLowerCase() === item.data.subreddit.toLowerCase(),
      )

      if (community) {
        return false
      }

      const user = filters.find(
        (filter) =>
          filter.type === 'user' &&
          filter.value.toLowerCase() === item.data.author.toLowerCase(),
      )

      if (user) {
        return false
      }

      return true
    })
    .map((item) => {
      if (item.kind === 't1') {
        return transformComment(item)
      }

      return transformPost(item.data, {
        seen,
      })
    })
}

export async function filterCommunities({
  data,
}: CommunitiesSchema): Promise<Array<Community>> {
  const filters = await db
    .select()
    .from(db.schema.filters)
    .where(eq(db.schema.filters.type, 'community'))

  return data.children
    .filter((item) => {
      const community = filters.find(
        (filter) =>
          filter.type === 'community' &&
          filter.value.toLowerCase() === item.data.display_name,
      )

      if (community) {
        return false
      }

      return true
    })
    .map((item) => transformCommunity(item.data))
}

export async function filterUsers({ data }: UsersSchema): Promise<Array<User>> {
  const filters = await db
    .select()
    .from(db.schema.filters)
    .where(eq(db.schema.filters.type, 'user'))

  return compact(
    data.children
      .filter((item) => {
        const user = filters.find(
          (filter) =>
            filter.type === 'user' &&
            filter.value.toLowerCase() === item.data.name,
        )

        if (user) {
          return false
        }

        return true
      })
      .map((item) => transformUser(item.data)),
  )
}
