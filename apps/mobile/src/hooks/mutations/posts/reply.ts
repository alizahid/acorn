import { useMutation } from '@tanstack/react-query'
import { create } from 'mutative'

import {
  type PostQueryData,
  type PostQueryKey,
} from '~/hooks/queries/posts/post'
import { type PostsQueryData } from '~/hooks/queries/posts/posts'
import { queryClient } from '~/lib/query'
import { addPrefix, redditApi } from '~/lib/reddit'
import { CreateCommentSchema } from '~/schemas/reddit/comments'
import { useAuth } from '~/stores/auth'
import { transformComment } from '~/transformers/comment'

type Variables = {
  commentId?: string
  postId: string
  text: string
}

export function usePostReply() {
  const { accessToken, expired } = useAuth()

  const { isPending, mutate } = useMutation<
    CreateCommentSchema | undefined,
    Error,
    Variables
  >({
    async mutationFn(variables) {
      if (expired) {
        return
      }

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

      const response = await redditApi({
        accessToken,
        body,
        method: 'post',
        url: '/api/comment',
      })

      return CreateCommentSchema.parse(response)
    },
    onMutate(variables) {
      queryClient.setQueryData<PostQueryData>(
        ['post', variables.postId] satisfies PostQueryKey,
        (previous) => {
          if (!previous) {
            return previous
          }

          return create(previous, (draft) => {
            draft.post.comments++
          })
        },
      )

      updateAll(variables)
    },
    onSuccess(data, variables) {
      if (!data) {
        return
      }

      queryClient.setQueryData<PostQueryData>(
        ['post', variables.postId] satisfies PostQueryKey,
        (previous) => {
          if (!previous) {
            return previous
          }

          const comment = transformComment(data.json.data.things[0])

          return create(previous, (draft) => {
            if (comment.data.parentId) {
              const index = draft.comments.findIndex(
                (item) => item.data.id === comment.data.parentId,
              )

              const parent = draft.comments[index]

              comment.data.depth = parent.data.depth + 1

              draft.comments.splice(index + 1, 0, comment)
            } else {
              draft.comments.unshift(comment)
            }
          })
        },
      )
    },
  })

  return {
    isPending,
    reply: mutate,
  }
}

function updateAll(variables: Variables) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['posts'],
  })

  for (const query of queries) {
    queryClient.setQueryData<PostsQueryData>(query.queryKey, (data) => {
      if (!data) {
        return data
      }

      return create(data, (draft) => {
        let found = false

        for (const page of draft.pages) {
          if (found) {
            break
          }

          for (const item of page.posts) {
            if (item.id === variables.postId) {
              item.comments++

              found = true

              break
            }
          }
        }
      })
    })
  }
}
