import { useMutation } from '@tanstack/react-query'

import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'

type Variables = {
  id: string
  postId?: string
}

export function useCommentRemove() {
  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('id', addPrefix(variables.id, 'comment'))

      await reddit({
        body,
        method: 'post',
        url: '/api/del',
      })
    },
    onMutate(variables) {
      updatePosts(variables.id, undefined, true)

      if (variables.postId) {
        updatePost(variables.postId, (draft) => {
          draft.comments = draft.comments.filter(
            (comment) => comment.data.id !== variables.id,
          )
        })
      }
    },
  })

  return {
    isPending,
    remove: mutate,
  }
}
