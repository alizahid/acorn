import { type Comment, type Post } from '@acorn/reddit'
import { createId } from '@paralleldrive/cuid2'
import { useMutation } from '@tanstack/react-query'
import { create, type Draft } from 'mutative'

import { db } from '~/db'
import { type PostsQueryData, updatePosts } from '~/hooks/queries/posts/posts'
import { isPost } from '~/lib/guards'
import { queryClient } from '~/lib/query'
import { addPrefix } from '~/lib/reddit'
import { createApi } from '~/reddit/api'

import { type PostQueryData, updatePost } from '../queries/posts/post'

type Variables = {
  action: 'hide' | 'unhide'
  id: string
} & (
  | {
      postId: string
      type: 'comment'
    }
  | {
      type: 'post'
    }
  | {
      name: string
      type: 'community' | 'user'
    }
)

export function useHide() {
  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      if (variables.type === 'post') {
        const reddit = await createApi()

        await reddit.posts[variables.action]({
          id: addPrefix(variables.id, 'link'),
        })
      }

      if (variables.type === 'user') {
        const reddit = await createApi()

        await reddit.users[variables.action === 'hide' ? 'block' : 'unblock']({
          id: variables.id,
        })
      }

      if (variables.action === 'unhide' || variables.type === 'post') {
        return
      }

      await db.insert(db.schema.filters).values({
        id: createId(),
        type: variables.type,
        value: 'name' in variables ? variables.name : variables.id,
      })
    },
    onMutate(variables) {
      if (variables.action === 'unhide') {
        return
      }

      if (variables.type === 'post') {
        updatePosts(
          variables.id,
          (draft) => {
            if (isPost(draft)) {
              draft.hidden = true
            }
          },
          true,
        )

        updatePost(variables.id, (draft) => {
          draft.post.hidden = true
        })
      }

      if (variables.type === 'comment') {
        updatePost(variables.postId, (draft) => {
          removeComment(draft, variables.id)
        })
      }

      if (variables.type === 'community' || variables.type === 'user') {
        const { name, type } = variables

        const feedQueries = queryClient.getQueryCache().findAll({
          queryKey: ['posts'],
        })

        for (const query of feedQueries) {
          queryClient.setQueryData<PostsQueryData>(
            query.queryKey,
            (previous) => {
              if (!previous) {
                return previous
              }

              return create(previous, (draft) => {
                for (const page of draft.pages) {
                  page.posts = page.posts.filter(
                    (item) => !matches(item, type, name),
                  )
                }
              })
            },
          )
        }

        const userQueries = queryClient.getQueryCache().findAll({
          queryKey: ['post'],
        })

        if (type === 'user') {
          for (const query of userQueries) {
            queryClient.setQueryData<PostQueryData>(
              query.queryKey,
              (previous) => {
                if (!previous) {
                  return previous
                }

                return create(previous, (draft) => {
                  for (const comment of draft.comments.filter((item) =>
                    matches(item, type, name),
                  )) {
                    removeComment(draft, comment.data.id)
                  }
                })
              },
            )
          }
        }
      }
    },
  })

  return {
    hide: mutate,
    isPending,
  }
}

function matches(
  item: Post | Comment,
  type: 'community' | 'user',
  name: string,
) {
  return isPost(item)
    ? (type === 'user' ? item.user.name : item.community.name) === name
    : item.type === 'reply' &&
        (type === 'user' ? item.data.user.name : item.data.post.community) ===
          name
}

function removeComment(draft: Draft<PostQueryData>, id: string) {
  const start = draft.comments.findIndex((comment) => comment.data.id === id)

  const depth = draft.comments[start]?.data.depth

  if (depth === undefined) {
    return
  }

  const end = draft.comments.findIndex(
    (comment, index) => index > start && comment.data.depth <= depth,
  )

  draft.comments.splice(start, (end < 0 ? draft.comments.length : end) - start)
}
