import { useMutation } from '@tanstack/react-query'

import { updatePost } from '~/hooks/queries/posts/post'
import { updateUserComment } from '~/hooks/queries/user/comments'
import { updateUserPost } from '~/hooks/queries/user/posts'
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
      updateUserComment(variables.commentId, (draft) => {
        draft.saved = variables.action === 'save'
      })

      updateUserPost(variables.commentId, (draft) => {
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
    },
  })

  return {
    isPending,
    save: mutate,
  }
}
