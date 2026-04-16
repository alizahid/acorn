import { useMutation } from '@tanstack/react-query'

import { getPost, updatePost } from '~/hooks/queries/posts/post'
import { REDDIT_URI, reddit } from '~/reddit/api'
import {
  CommentDataSchema,
  CommentMoreSchema,
  type CommentsSchema,
} from '~/schemas/comments'
import { PostSchema } from '~/schemas/post'
import { transformComment } from '~/transformers/comment'
import { type CommentSort } from '~/types/sort'

type Data = {
  after?: string | null
  comments: CommentsSchema['data']['children']
}

type Variables = {
  depth: number
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

      const parsed = CommentDataSchema.safeParse(rest)

      if (parsed.success) {
        result.push({
          data: parsed.data,
          kind: 't1',
        })
      }

      // Always recurse into replies even if this comment failed
      // validation, so we can still reach nested children
      if (
        replies &&
        typeof replies === 'object' &&
        (replies as Record<string, unknown>).data
      ) {
        const listing = (replies as Record<string, unknown>).data as Record<
          string,
          unknown
        >

        if (Array.isArray(listing.children)) {
          result.push(
            ...flattenComments(
              listing.children as Array<Record<string, unknown>>,
            ),
          )
        }
      }
    } else if (item.kind === 'more') {
      const parsed = CommentMoreSchema.safeParse(item.data)

      if (parsed.success) {
        result.push({
          data: parsed.data,
          kind: 'more',
        })
      }
    }
  }

  return result
}

export function useLoadMoreComments() {
  const { isPending, mutate } = useMutation<Data, Error, Variables>({
    async mutationFn(variables) {
      const isRootLevel = variables.parentId === variables.postId

      if (isRootLevel) {
        const url = new URL(`/comments/${variables.postId}`, REDDIT_URI)

        url.searchParams.set('sort', variables.sort)
        url.searchParams.set('threaded', 'false')
        url.searchParams.set('sr_detail', 'true')
        url.searchParams.set('limit', '50')

        const post = getPost(variables.postId)

        if (post?.after) {
          url.searchParams.set('after', post.after)
        }

        const response = await reddit({
          url,
        })

        const parsed = PostSchema.parse(response)

        return {
          after: parsed[1].data.after,
          comments: parsed[1].data.children,
        }
      }

      const url = new URL(`/comments/${variables.postId}`, REDDIT_URI)

      url.searchParams.set('sort', variables.sort)
      url.searchParams.set('sr_detail', 'true')
      url.searchParams.set('comment', variables.parentId)
      url.searchParams.set('depth', '100')
      url.searchParams.set('limit', '500')

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

        if (index < 0) {
          return
        }

        const existingIds = new Set(draft.comments.map((item) => item.data.id))

        // Calculate depth offset for nested more nodes
        // The comment parameter makes Reddit return the focused comment
        // at depth 0 (relative), but we need absolute depths
        let depthOffset = 0

        if (variables.parentId !== variables.postId) {
          const existingParent = draft.comments.find(
            (item) =>
              item.type === 'reply' && item.data.id === variables.parentId,
          )

          const actualParentDepth =
            existingParent?.type === 'reply'
              ? existingParent.data.depth
              : Math.max(0, variables.depth - 1)

          const responseParent = data.comments.find(
            (item) => item.kind === 't1' && item.data.id === variables.parentId,
          )

          const responseParentDepth =
            responseParent?.kind === 't1' ? (responseParent.data.depth ?? 0) : 0

          depthOffset = actualParentDepth - responseParentDepth
        }

        const comments = data.comments
          .map((item) => {
            const comment = transformComment(item)

            if (depthOffset !== 0) {
              comment.data.depth += depthOffset
            }

            return comment
          })
          .filter((item) => !existingIds.has(item.data.id))

        const more = draft.comments[index]

        if (more?.type === 'more') {
          const loadedIds = new Set(comments.map((item) => item.data.id))

          more.data.children = more.data.children.filter(
            (id) => !loadedIds.has(id),
          )

          if (more.data.children.length > 0) {
            draft.comments.splice(index, 0, ...comments)
          } else {
            draft.comments.splice(index, 1, ...comments)
          }
        } else {
          draft.comments.splice(index, 1, ...comments)
        }

        if (data.after !== undefined) {
          draft.after = data.after
        }
      })
    },
  })

  return {
    isPending,
    loadMore: mutate,
  }
}
