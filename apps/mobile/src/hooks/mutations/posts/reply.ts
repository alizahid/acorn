import { useMutation } from '@tanstack/react-query'

import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { updateSearch } from '~/hooks/queries/search/search'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { CreateCommentSchema } from '~/schemas/comments'
import { transformComment } from '~/transformers/comment'

type Variables = {
  commentId?: string
  postId: string
  text: string
}

export function usePostReply() {
  const { isPending, mutateAsync } = useMutation<
    CreateCommentSchema,
    Error,
    Variables
  >({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('api_type', 'json')
      body.append('text', variables.text)
      body.append(
        'thing_id',
        addPrefix(
          variables.commentId ?? variables.postId,
          variables.commentId ? 'comment' : 'link',
        ),
      )

      const response = await reddit({
        body,
        method: 'post',
        url: '/api/comment',
      })

      return CreateCommentSchema.parse(response)
    },
    onMutate(variables) {
      updatePost(variables.postId, (draft) => {
        draft.post.comments++
      })

      updatePosts(variables.postId, (draft) => {
        draft.comments++
      })

      updateSearch(variables.postId, (draft) => {
        draft.comments++
      })
    },
    onSuccess(data, variables) {
      const payload = data.json.data.things[0]

      if (!payload) {
        return
      }

      const comment = transformComment(payload)

      updatePost(variables.postId, (draft) => {
        if (comment.data.parentId) {
          const index = draft.comments.findIndex(
            (item) => item.data.id === comment.data.parentId,
          )

          const parent = draft.comments[index]

          if (!parent) {
            return
          }

          comment.data.depth = parent.data.depth + 1

          draft.comments.splice(index + 1, 0, comment)
        } else {
          draft.comments.unshift(comment)
        }
      })
    },
  })

  return {
    isPending,
    reply: mutateAsync,
  }
}
