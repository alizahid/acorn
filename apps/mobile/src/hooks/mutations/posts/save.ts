import { useMutation } from '@tanstack/react-query'

import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { updateSearch } from '~/hooks/queries/search/search'
import { updateUserPost } from '~/hooks/queries/user/posts'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'

type Variables = {
  action: 'save' | 'unsave'
  postId: string
}

export function usePostSave() {
  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('id', addPrefix(variables.postId, 'link'))

      await reddit({
        body,
        method: 'post',
        url: `/api/${variables.action}`,
      })
    },
    onMutate(variables) {
      updatePost(variables.postId, (draft) => {
        draft.post.saved = variables.action === 'save'
      })

      updatePosts(variables.postId, (draft) => {
        draft.saved = variables.action === 'save'
      })

      updateSearch(variables.postId, (draft) => {
        draft.saved = variables.action === 'save'
      })

      updateUserPost(variables.postId, (draft) => {
        draft.saved = variables.action === 'save'
      })
    },
  })

  return {
    isPending,
    save: mutate,
  }
}
