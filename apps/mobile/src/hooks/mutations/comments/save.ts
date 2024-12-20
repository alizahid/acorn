import { useMutation } from '@tanstack/react-query'

import { updatePost } from '~/hooks/queries/posts/post'
import { updateUserComment } from '~/hooks/queries/user/comments'
import { triggerFeedback } from '~/lib/feedback'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'

type Variables = {
  action: 'save' | 'unsave'
  commentId: string
  postId?: string
}

export function useCommentSave() {
  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('id', addPrefix(variables.commentId, 'comment'))

      await reddit({
        body,
        method: 'post',
        url: `/api/${variables.action}`,
      })
    },
    onMutate(variables) {
      triggerFeedback(variables.action === 'save' ? 'save' : 'undo')

      updateUserComment(variables.commentId, (draft) => {
        draft.saved = variables.action === 'save'
      })

      if (variables.postId) {
        updatePost(variables.postId, (draft) => {
          for (const comment of draft.comments) {
            if (
              comment.type === 'reply' &&
              comment.data.id === variables.commentId
            ) {
              comment.data.saved = variables.action === 'save'

              break
            }
          }
        })
      }

      // TODO: update user saved
    },
  })

  return {
    isPending,
    save: mutate,
  }
}
