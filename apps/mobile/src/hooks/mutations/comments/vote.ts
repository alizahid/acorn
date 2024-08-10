import { useMutation } from '@tanstack/react-query'

import { updatePost } from '~/hooks/queries/posts/post'
import { updateComments } from '~/hooks/queries/user/comments'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { useAuth } from '~/stores/auth'

type Variables = {
  commentId: string
  direction: 1 | 0 | -1
  postId?: string
}

export function useCommentVote() {
  const { expired } = useAuth()

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      if (expired) {
        return
      }

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
      updateComments(variables.commentId, (draft) => {
        draft.votes =
          draft.votes -
          (draft.liked ? 1 : draft.liked === null ? 0 : -1) +
          variables.direction

        draft.liked =
          variables.direction === 1
            ? true
            : variables.direction === 0
              ? null
              : false
      })

      if (variables.postId) {
        updatePost(variables.postId, (draft) => {
          for (const item of draft.comments) {
            if (item.type === 'reply' && item.data.id === variables.commentId) {
              item.data.votes =
                item.data.votes -
                (item.data.liked ? 1 : item.data.liked === null ? 0 : -1) +
                variables.direction

              item.data.liked =
                variables.direction === 1
                  ? true
                  : variables.direction === 0
                    ? null
                    : false

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
