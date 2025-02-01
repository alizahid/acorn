import { useMutation } from '@tanstack/react-query'
import { formatISO } from 'date-fns'

import { getDatabase } from '~/lib/db'
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
      const db = await getDatabase()

      await db.runAsync(
        'INSERT INTO history (post_id, seen_at) VALUES ($post, $time) ON CONFLICT (post_id) DO NOTHING',
        {
          $post: variables.id,
          $time: formatISO(new Date()),
        },
      )
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
