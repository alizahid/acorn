import { useMutation } from '@tanstack/react-query'

import { updatePost } from '~/hooks/queries/posts/post'
import { REDDIT_URI, reddit } from '~/reddit/api'
import { PostSchema } from '~/schemas/post'
import { transformComment } from '~/transformers/comment'
import { type CommentSort } from '~/types/sort'

type Data = {
  comments: PostSchema[1]['data']['children']
}

type Variables = {
  id: string
  parentId: string
  postId: string
  sort: CommentSort
}

export function useLoadMoreComments() {
  const { isPending, mutate } = useMutation<Data, Error, Variables>({
    async mutationFn(variables) {
      const url = new URL(`/comments/${variables.postId}`, REDDIT_URI)

      url.searchParams.set('sort', variables.sort)
      url.searchParams.set('threaded', 'false')
      url.searchParams.set('sr_detail', 'true')

      if (variables.parentId !== variables.postId) {
        url.searchParams.set('comment', variables.parentId)
      }

      const response = await reddit({
        url,
      })

      const parsed = PostSchema.parse(response)

      return {
        comments: parsed[1].data.children,
      }
    },
    onSuccess(data, variables) {
      updatePost(variables.postId, (draft) => {
        const index = draft.comments.findIndex(
          (item) => item.type === 'more' && item.data.id === variables.id,
        )

        if (index >= 0) {
          const existingIds = new Set(
            draft.comments.map((item) => item.data.id),
          )

          const comments = data.comments
            .map((item) => transformComment(item))
            .filter((item) => !existingIds.has(item.data.id))

          draft.comments.splice(index, 1, ...comments)
        }
      })
    },
  })

  return {
    isPending,
    loadMore: mutate,
  }
}
