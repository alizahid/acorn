import { createId } from '@paralleldrive/cuid2'
import { useMutation } from '@tanstack/react-query'
import { and, eq } from 'drizzle-orm'

import { db } from '~/db'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { isPost } from '~/lib/guards'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'

import { updatePost } from '../queries/posts/post'

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
        const body = new FormData()

        body.append('id', addPrefix(variables.id, 'link'))

        await reddit({
          body,
          method: 'post',
          url: `/api/${variables.action}`,
        })
      }
    },
    async onMutate(variables) {
      if (variables.action === 'unhide') {
        if (variables.type !== 'comment') {
          await db
            .delete(db.schema.filters)
            .where(
              and(
                eq(
                  db.schema.filters.id,
                  'name' in variables ? variables.name : variables.id,
                ),
                eq(db.schema.filters.type, variables.type),
              ),
            )
        }

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
          const index = draft.comments.findIndex(
            (comment) => comment.data.id === variables.id,
          )

          draft.comments.splice(index, 1)
        })
      }

      if (variables.type !== 'comment') {
        await db.insert(db.schema.filters).values({
          id: createId(),
          type: variables.type,
          value: 'name' in variables ? variables.name : variables.id,
        })
      }
    },
  })

  return {
    hide: mutate,
    isPending,
  }
}
