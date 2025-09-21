import { useMutation } from '@tanstack/react-query'

import { db } from '~/db'
import { isPost } from '~/lib/guards'
import { usePreferences } from '~/stores/preferences'

import { useHide } from './moderation/hide'
import { updatePost } from './queries/posts/post'
import { updatePosts } from './queries/posts/posts'
import { updateSearch } from './queries/search/search'

type Variables = {
  id: string
}

export function useHistory() {
  const { hideSeen } = usePreferences()

  const { hide } = useHide()

  const { mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      await db
        .insert(db.schema.history)
        .values({
          postId: variables.id,
        })
        .onConflictDoNothing()
    },
    onMutate(variables) {
      if (hideSeen) {
        hide({
          action: 'hide',
          id: variables.id,
          type: 'post',
        })
      }

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
    addPost: mutate,
  }
}
