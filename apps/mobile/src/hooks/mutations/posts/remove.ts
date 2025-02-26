import { useMutation } from '@tanstack/react-query'

import { updatePosts } from '~/hooks/queries/posts/posts'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'

type Variables = {
  id: string
}

export function usePostRemove() {
  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('id', addPrefix(variables.id, 'link'))

      await reddit({
        body,
        method: 'post',
        url: '/api/del',
      })
    },
    onMutate(variables) {
      updatePosts(variables.id, undefined, true)
    },
  })

  return {
    isPending,
    remove: mutate,
  }
}
