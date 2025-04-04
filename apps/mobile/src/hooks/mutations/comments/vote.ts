import { useMutation } from '@tanstack/react-query'
import { type Draft } from 'mutative'

import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { triggerFeedback } from '~/lib/feedback'
import { isComment } from '~/lib/guards'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { type CommentReply } from '~/types/comment'

type Variables = {
  commentId: string
  direction: 1 | 0 | -1
  postId?: string
}

export function useCommentVote() {
  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('id', addPrefix(variables.commentId, 'comment'))
      body.append('dir', String(variables.direction))

      await reddit({
        body,
        method: 'post',
        url: '/api/vote',
      })
    },
    onMutate(variables) {
      triggerFeedback(
        variables.direction === 1
          ? 'up'
          : variables.direction === -1
            ? 'down'
            : 'undo',
      )

      updatePosts(variables.commentId, (draft) => {
        if (isComment(draft) && draft.type === 'reply') {
          update(variables, draft.data)
        }
      })

      if (variables.postId) {
        updatePost(variables.postId, (draft) => {
          for (const comment of draft.comments) {
            if (
              comment.type === 'reply' &&
              comment.data.id === variables.commentId
            ) {
              update(variables, comment.data)

              break
            }
          }
        })
      }
    },
  })

  return {
    isPending,
    vote: mutate,
  }
}

function update(variables: Variables, draft: Draft<CommentReply>) {
  draft.votes =
    draft.votes -
    (draft.liked ? 1 : draft.liked === null ? 0 : -1) +
    variables.direction

  draft.liked =
    variables.direction === 1 ? true : variables.direction === 0 ? null : false
}
