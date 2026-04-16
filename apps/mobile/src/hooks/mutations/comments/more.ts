import { useMutation } from '@tanstack/react-query'

import { updatePost } from '~/hooks/queries/posts/post'
import { REDDIT_URI, reddit } from '~/reddit/api'
import {
  CommentDataSchema,
  CommentMoreSchema,
  type CommentsSchema,
} from '~/schemas/comments'
import { transformComment } from '~/transformers/comment'
import { type CommentSort } from '~/types/sort'

type Data = {
  comments: CommentsSchema['data']['children']
}

type Variables = {
  id: string
  parentId: string
  postId: string
  sort: CommentSort
}

function flattenComments(
  children: Array<Record<string, unknown>>,
): CommentsSchema['data']['children'] {
  const result: CommentsSchema['data']['children'] = []

  for (const item of children) {
    if (item.kind === 't1') {
      const data = item.data as Record<string, unknown>
      const { replies, ...rest } = data

      result.push({
        data: CommentDataSchema.parse(rest),
        kind: 't1',
      })

      if (
        replies &&
        typeof replies === 'object' &&
        (replies as Record<string, unknown>).data
      ) {
        const listing = (replies as Record<string, unknown>)
          .data as Record<string, unknown>

        if (Array.isArray(listing.children)) {
          result.push(
            ...flattenComments(
              listing.children as Array<Record<string, unknown>>,
            ),
          )
        }
      }
    } else if (item.kind === 'more') {
      result.push({
        data: CommentMoreSchema.parse(item.data),
        kind: 'more',
      })
    }
  }

  return result
}

export function useLoadMoreComments() {
  const { isPending, mutate } = useMutation<Data, Error, Variables>({
    async mutationFn(variables) {
      const url = new URL(`/comments/${variables.postId}`, REDDIT_URI)

      url.searchParams.set('sort', variables.sort)
      url.searchParams.set('sr_detail', 'true')

      if (variables.parentId !== variables.postId) {
        url.searchParams.set('comment', variables.parentId)
      }

      const response = await reddit({
        url,
      })

      const listing = (response as Array<Record<string, unknown>>)[1] as
        | Record<string, unknown>
        | undefined

      const data = listing?.data as Record<string, unknown> | undefined

      const children = Array.isArray(data?.children)
        ? (data.children as Array<Record<string, unknown>>)
        : []

      return {
        comments: flattenComments(children),
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
