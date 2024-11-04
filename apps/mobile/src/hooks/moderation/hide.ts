import { useMutation } from '@tanstack/react-query'

import { updatePosts } from '~/hooks/queries/posts/posts'
import { addHidden, removeHidden } from '~/lib/db/hidden'
import { queryClient } from '~/lib/query'
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
      type: 'community' | 'user' | 'post'
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
        await removeHidden(variables.id)

        return
      }

      if (['community', 'user'].includes(variables.type)) {
        await addHidden(variables.id, variables.type)
      }

      if (variables.type === 'comment') {
        updatePost(variables.postId, (draft) => {
          const index = draft.comments.findIndex(
            (comment) => comment.data.id === variables.id,
          )

          draft.comments.splice(index, 1)
        })
      } else if (variables.type === 'post') {
        updatePosts(
          variables.id,
          (draft) => {
            draft.hidden = true
          },
          true,
        )

        updatePost(variables.id, (draft) => {
          draft.post.hidden = true
        })
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['posts'],
        })
      }

      if (['comment', 'post'].includes(variables.type)) {
        await addHidden(variables.id, variables.type)
      }
    },
  })

  return {
    hide: mutate,
    isPending,
  }
}
