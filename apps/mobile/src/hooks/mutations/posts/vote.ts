import { type CommentReply, type Post } from '@acorn/reddit'
import { useMutation } from '@tanstack/react-query'
import { type Draft } from 'mutative'
import { useShallow } from 'zustand/react/shallow'

import { useHistory } from '~/hooks/history'
import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { updateSearch } from '~/hooks/queries/search/search'
import { triggerFeedback } from '~/lib/feedback'
import { isPost } from '~/lib/guards'
import { addPrefix } from '~/lib/reddit'
import { createApi } from '~/reddit/api'
import { usePreferences } from '~/stores/preferences'

type Variables = {
  direction: 1 | 0 | -1
  postId: string
}

export function usePostVote() {
  const { seenOnVote } = usePreferences(
    useShallow((state) => ({
      seenOnVote: state.seenOnVote,
    })),
  )

  const { addPost } = useHistory()

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const reddit = await createApi()

      await reddit.posts[actions[variables.direction]]({
        id: addPrefix(variables.postId, 'link'),
      })
    },
    onMutate(variables) {
      triggerFeedback(
        variables.direction === 1
          ? 'up'
          : variables.direction === -1
            ? 'down'
            : 'undo',
      )

      if (seenOnVote) {
        addPost({
          id: variables.postId,
        })
      }

      updatePost(variables.postId, (draft) => {
        update(variables, draft.post)
      })

      updatePosts(variables.postId, (draft) => {
        if (isPost(draft)) {
          update(variables, draft)
        }
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

const actions = {
  '-1': 'downvote',
  0: 'unvote',
  1: 'upvote',
} as const

function update(variables: Variables, draft: Draft<Post | CommentReply>) {
  draft.votes =
    draft.votes -
    (draft.liked ? 1 : draft.liked === null ? 0 : -1) +
    variables.direction

  draft.liked =
    variables.direction === 1 ? true : variables.direction === 0 ? null : false
}
