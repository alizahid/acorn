import { useMutation } from '@tanstack/react-query'

import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { triggerFeedback } from '~/lib/feedback'
import { isComment } from '~/lib/guards'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { usePreferences } from '~/stores/preferences'

import { useCommentVote } from './vote'

type Variables = {
  action: 'save' | 'unsave'
  commentId: string
  postId?: string
}

export function useCommentSave() {
  const { upvoteOnSave } = usePreferences()

  const { vote } = useCommentVote()

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
      if (upvoteOnSave && variables.action === 'save') {
        vote({
          commentId: variables.commentId,
          direction: 1,
          postId: variables.postId,
        })
      }

      triggerFeedback(variables.action === 'save' ? 'save' : 'undo')

      updatePosts(variables.commentId, (draft) => {
        if (isComment(draft) && draft.type === 'reply') {
          draft.data.saved = variables.action === 'save'
        }
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
