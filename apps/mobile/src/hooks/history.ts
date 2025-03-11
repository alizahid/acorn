import { useMutation } from '@tanstack/react-query'

import { db } from '~/db'
import { isPost } from '~/lib/guards'

import { updatePost } from './queries/posts/post'
import { updatePosts } from './queries/posts/posts'
import { updateSearch } from './queries/search/search'

type Variables = {
  id: string
}

export function useHistory() {
  const { mutate: addPost } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      await db
        .insert(db.schema.history)
        .values({
          postId: variables.id,
        })
        .onConflictDoNothing()
    },
    onMutate(variables) {
      updatePost(variables.id, (draft) => {
        draft.post.seen = true
      })

      updatePosts(variables.id, (draft) => {
        if (isPost(draft)) {
          draft.seen = true
        }
      })

      updateSearch(variables.id, (draft) => {
        draft.seen = true
      })
    },
  })

  return {
    addPost,
  }
}
