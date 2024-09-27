import { useMutation } from '@tanstack/react-query'

import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { updateSearch } from '~/hooks/queries/search/search'
import { updateUserPost } from '~/hooks/queries/user/posts'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { type CommentReply } from '~/types/comment'
import { type Post } from '~/types/post'

type Variables = {
  direction: 1 | 0 | -1
  postId: string
}

export function usePostVote() {
  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('id', addPrefix(variables.postId, 'link'))
      body.append('dir', String(variables.direction))

      await reddit({
        body,
        method: 'post',
        url: '/api/vote',
      })
    },
    onMutate(variables) {
      updatePost(variables.postId, (draft) => {
        update(variables, draft.post)
      })

      updatePosts(variables.postId, (draft) => {
        update(variables, draft)
      })

      updateSearch(variables.postId, (draft) => {
        update(variables, draft)
      })

      updateUserPost(variables.postId, (draft) => {
        update(variables, draft)
      })
    },
  })

  return {
    isPending,
    vote: mutate,
  }
}

function update(variables: Variables, draft: Post | CommentReply) {
  draft.votes =
    draft.votes -
    (draft.liked ? 1 : draft.liked === null ? 0 : -1) +
    variables.direction

  draft.liked =
    variables.direction === 1 ? true : variables.direction === 0 ? null : false
}
