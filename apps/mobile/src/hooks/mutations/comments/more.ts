import { useMutation } from '@tanstack/react-query'
import { create } from 'mutative'

import { getPost, updatePost } from '~/hooks/queries/posts/post'
import { addPrefix } from '~/lib/reddit'
import { REDDIT_URI, reddit } from '~/reddit/api'
import { type CommentsSchema, MoreCommentsSchema } from '~/schemas/comments'
import { PostSchema } from '~/schemas/post'
import { transformComment } from '~/transformers/comment'
import { type Comment } from '~/types/comment'
import { type CommentSort } from '~/types/sort'

const PAGE_SIZE = 20

type Data = {
  comments: MoreCommentsSchema | Array<CommentsSchema>
}

type Variables = {
  children: Array<string>
  depth: number
  id: string
  postId: string
  sort: CommentSort
}

export function useLoadMoreComments() {
  const { isPending, mutate } = useMutation<Data, Error, Variables>({
    async mutationFn(variables) {
      if (variables.depth === 0) {
        const chunks = await Promise.all(
          variables.children.slice(0, PAGE_SIZE).map(async (id) => {
            const url = new URL(
              `/comments/${variables.postId}/comment/${id}`,
              REDDIT_URI,
            )

            url.searchParams.set('threaded', 'false')
            url.searchParams.set('sr_detail', 'true')

            const response = await reddit({
              url,
            })

            return PostSchema.parse(response)
          }),
        )

        return {
          comments: chunks.flatMap((chunk) => chunk[1]),
        }
      }

      const url = new URL('/api/info.json', REDDIT_URI)

      url.searchParams.set('api_type', 'json')
      url.searchParams.set(
        'id',
        variables.children
          .slice(0, PAGE_SIZE)
          .map((id) => addPrefix(id, 'comment'))
          .join(','),
      )

      const response = await reddit({
        url,
      })

      const comments = MoreCommentsSchema.parse(response)

      return {
        comments,
      }
    },
    onSuccess(data, variables) {
      updatePost(variables.postId, (draft) => {
        const index = draft.comments.findIndex(
          (item) => item.type === 'more' && item.data.id === variables.id,
        )

        if (index >= 0) {
          const post = getPost(variables.postId)

          const items = Array.isArray(data.comments)
            ? data.comments.flatMap((item) => item.data.children)
            : data.comments.data.children

          const comments = items.map((item) => transformComment(item))

          const replies = comments.map((comment) =>
            create(comment, (draft) => {
              if (!draft.data.parentId) {
                return
              }

              draft.data.depth = getParentDepth(
                [...comments, ...(post?.comments ?? [])],
                comment.data.parentId,
              )
            }),
          )

          const more = draft.comments[index]

          if (more?.type === 'more') {
            more.data.children = more.data.children.slice(PAGE_SIZE)

            if (more.data.children.length > 0) {
              draft.comments.splice(index, 1, ...replies, more)

              return
            }
          }

          draft.comments.splice(index, 1, ...replies)
        }
      })
    },
  })

  return {
    isPending,
    loadMore: mutate,
  }
}

function getParentDepth(comments: Array<Comment>, parentId?: string): number {
  if (!parentId) {
    return 0
  }

  const parent = comments.find((item) => item.data.id === parentId)

  if (parent?.data.parentId) {
    return 1 + getParentDepth(comments, parent.data.parentId)
  }

  return 1
}
