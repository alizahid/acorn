import { useMutation } from '@tanstack/react-query'

import { updatePost } from '~/hooks/queries/posts/post'
import { updateComments } from '~/hooks/queries/user/comments'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { useAuth } from '~/stores/auth'

type Variables = {
  action: 'save' | 'unsave'
  commentId: string
  postId?: string
}

export function useCommentSave() {
  const { expired } = useAuth()

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      if (expired) {
        return
      }

      const body = new FormData()

      body.append('id', addPrefix(variables.commentId, 'comment'))

      await reddit({
        body,
        method: 'post',
        url: `/api/${variables.action}`,
      })
    },
    onMutate(variables) {
      updateComments(variables.commentId, (draft) => {
        draft.saved = variables.action === 'save'
      })

      if (variables.postId) {
        updatePost(variables.postId, (draft) => {
          for (const item of draft.comments) {
            if (item.type === 'reply' && item.data.id === variables.commentId) {
              item.data.saved = variables.action === 'save'

              break
            }
          }
        })
      }
    },
  })

  return {
    isPending,
    save: mutate,
  }
}
