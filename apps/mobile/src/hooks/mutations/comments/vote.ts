import { type CommentReply } from '@acorn/reddit'
import { useMutation } from '@tanstack/react-query'
import { type Draft } from 'mutative'

import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { triggerFeedback } from '~/lib/feedback'
import { isComment } from '~/lib/guards'
import { addPrefix } from '~/lib/reddit'
import { createApi } from '~/reddit/api'

type Variables = {
  action: 'downvote' | 'unvote' | 'upvote'
  commentId: string
  postId?: string
}

export function useCommentVote() {
  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const reddit = await createApi()

      await reddit.comments[variables.action]({
        id: addPrefix(variables.commentId, 'comment'),
      })
    },
    onMutate(variables) {
      triggerFeedback(
        variables.action === 'upvote'
          ? 'up'
          : variables.action === 'downvote'
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
    (variables.action === 'upvote'
      ? 1
      : variables.action === 'downvote'
        ? -1
        : 0)

  draft.liked =
    variables.action === 'upvote'
      ? true
      : variables.action === 'downvote'
        ? false
        : null
}
