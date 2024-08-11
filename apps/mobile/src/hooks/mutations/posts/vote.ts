import { useMutation } from '@tanstack/react-query'

import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { updateSearch } from '~/hooks/queries/search/search'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { useAuth } from '~/stores/auth'
import { type Post } from '~/types/post'

type Variables = {
  direction: 1 | 0 | -1
  postId: string
}

export function usePostVote() {
  const { expired } = useAuth()

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      if (expired) {
        return
      }

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
    },
  })

  return {
    isPending,
    vote: mutate,
  }
}

function update(variables: Variables, draft: Post) {
  draft.votes =
    draft.votes -
    (draft.liked ? 1 : draft.liked === null ? 0 : -1) +
    variables.direction

  draft.liked =
    variables.direction === 1 ? true : variables.direction === 0 ? null : false
}
