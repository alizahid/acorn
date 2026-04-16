import { useMutation } from '@tanstack/react-query'

import { updatePost } from '~/hooks/queries/posts/post'
import { REDDIT_URI, reddit } from '~/reddit/api'
import { type CommentsSchema } from '~/schemas/comments'
import { PostSchema } from '~/schemas/post'
import { transformComment } from '~/transformers/comment'
import { type CommentSort } from '~/types/sort'

type Data = {
  comments: CommentsSchema['data']['children']
  remaining: Array<string>
}

type Variables = {
  children: Array<string>
  depth: number
  id: string
  parentId: string
  postId: string
  sort: CommentSort
}

const BATCH_SIZE = 10

export function useLoadMoreComments() {
  const { isPending, mutate } = useMutation<Data, Error, Variables>({
    async mutationFn(variables) {
      if (variables.depth > 0) {
        const response = await fetchSubtree({
          comment: variables.parentId,
          postId: variables.postId,
          sort: variables.sort,
        })

        const descendants = response[1].data.children.filter(
          (item) =>
            !(item.kind === 't1' && item.data.id === variables.parentId),
        )

        return {
          comments: descendants,
          remaining: [],
        }
      }

      const batch = variables.children.slice(0, BATCH_SIZE)

      const responses = await Promise.all(
        batch.map((comment) =>
          fetchSubtree({
            comment,
            postId: variables.postId,
            sort: variables.sort,
          }),
        ),
      )

      return {
        comments: responses.flatMap((item) => item[1].data.children),
        remaining: variables.children.slice(BATCH_SIZE),
      }
    },
    onSuccess(data, variables) {
      updatePost(variables.postId, (draft) => {
        const index = draft.comments.findIndex(
          (item) => item.type === 'more' && item.data.id === variables.id,
        )

        if (index < 0) {
          return
        }

        const comments = data.comments.map((item) => transformComment(item))

        const more = draft.comments[index]

        if (more?.type === 'more' && data.remaining.length > 0) {
          more.data.children = data.remaining
          draft.comments.splice(index, 1, ...comments, more)

          return
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

async function fetchSubtree({
  comment,
  postId,
  sort,
}: {
  comment: string
  postId: string
  sort: CommentSort
}) {
  const url = new URL(`/comments/${postId}`, REDDIT_URI)

  url.searchParams.set('comment', comment)
  url.searchParams.set('limit', '500')
  url.searchParams.set('threaded', 'false')
  url.searchParams.set('sr_detail', 'true')
  url.searchParams.set('sort', sort)

  const response = await reddit({
    url,
  })

  return PostSchema.parse(response)
}
