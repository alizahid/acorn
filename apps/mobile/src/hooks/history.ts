import { useMutation } from '@tanstack/react-query'

import { db } from '~/db'
import { isPost } from '~/lib/guards'
import { addPrefix } from '~/lib/reddit'

import { updatePost } from './queries/posts/post'
import { updatePosts } from './queries/posts/posts'
import { updateSearch } from './queries/search/search'

type Variables = {
  id: string
}

export function useHistory() {
  const { mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      await db
        .insert(db.schema.history)
        .values({
          postId: addPrefix(variables.id, 'link'),
        })
        .onConflictDoNothing()
    },
    onMutate(variables) {
      const id = addPrefix(variables.id, 'link')

      updatePost(id, (draft) => {
        draft.post.seen = true
      })

      updatePosts(id, (draft) => {
        if (isPost(draft)) {
          draft.seen = true
        }
      })

      updateSearch(id, (draft) => {
        draft.seen = true
      })
    },
  })

  return {
    addPost: mutate,
  }
}
