import { type PostPoll } from '@acorn/reddit'
import { useMutation } from '@tanstack/react-query'

import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { updateSearch } from '~/hooks/queries/search/search'
import { isPost } from '~/lib/guards'
import { createApi } from '~/reddit/api'

type Variables = {
  postId: string
  option: string
}

export function usePostPoll() {
  const { isPending, mutate } = useMutation<PostPoll, Error, Variables>({
    async mutationFn(variables) {
      const reddit = await createApi()

      return reddit.posts.votePoll({
        id: variables.postId,
        option: variables.option,
      })
    },
    onSuccess(poll, variables) {
      updatePost(variables.postId, (draft) => {
        draft.post.poll = poll
      })

      updatePosts(variables.postId, (draft) => {
        if (isPost(draft)) {
          draft.poll = poll
        }
      })

      updateSearch(variables.postId, (draft) => {
        draft.poll = poll
      })
    },
  })

  return {
    isPending,
    vote: mutate,
  }
}
