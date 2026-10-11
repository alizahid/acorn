import { type Comment, type CommentMore } from '@acorn/reddit'
import { useMutation } from '@tanstack/react-query'

import { createMore, updatePost } from '~/hooks/queries/posts/post'
import { createApi } from '~/reddit/api'
import { type CommentSort } from '~/types/sort'

type Data = {
  comments: Array<Comment>
  cursor: string | null
}

type Variables = {
  comment: CommentMore
  postId: string
  sort: CommentSort
}

export function useLoadMoreComments() {
  const { isPending, mutate } = useMutation<Data, Error, Variables>({
    async mutationFn(variables) {
      const reddit = await createApi()

      return reddit.comments.list({
        after: variables.comment.cursor,
        postId: variables.postId,
        sort: variables.sort,
      })
    },
    onSuccess(data, variables) {
      updatePost(variables.postId, (draft) => {
        const index = draft.comments.findIndex(
          (item) =>
            item.type === 'more' && item.data.id === variables.comment.id,
        )

        if (index < 0) {
          return
        }

        const comments = data.cursor
          ? [...data.comments, createMore(variables.postId, data.cursor)]
          : data.comments

        // place replies under their parent, whatever depth the page reports
        for (const comment of comments) {
          const parent = [...draft.comments, ...comments].find(
            (item) => item.data.id === comment.data.parentId,
          )

          comment.data.depth = parent ? parent.data.depth + 1 : 0
        }

        draft.comments.splice(index, 1, ...comments)
      })
    },
  })

  return {
    isPending,
    loadMore: mutate,
  }
}
