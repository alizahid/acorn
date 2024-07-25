import { useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'mutative'

import {
  type PostQueryData,
  type PostQueryKey,
} from '~/hooks/queries/posts/post'
import { TYPE_COMMENT } from '~/lib/const'
import { redditApi } from '~/lib/reddit'
import { useAuth } from '~/stores/auth'

type Variables = {
  commentId: string
  direction: 1 | 0 | -1
  postId?: string
}

export function useCommentVote() {
  const queryClient = useQueryClient()

  const { accessToken, expired } = useAuth()

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      if (expired) {
        return
      }

      const body = new FormData()

      body.append('id', `${TYPE_COMMENT}${variables.commentId}`)
      body.append('dir', String(variables.direction))

      await redditApi({
        accessToken,
        body,
        method: 'post',
        url: '/api/vote',
      })
    },
    onMutate(variables) {
      if (variables.postId) {
        queryClient.setQueryData<PostQueryData>(
          ['post', variables.postId] satisfies PostQueryKey,
          (data) => {
            if (!data) {
              return data
            }

            return create(data, (draft) => {
              for (const item of draft.comments) {
                if (item.id === variables.postId) {
                  item.votes =
                    item.votes -
                    (item.liked ? 1 : item.liked === null ? 0 : -1) +
                    variables.direction

                  item.liked =
                    variables.direction === 1
                      ? true
                      : variables.direction === 0
                        ? null
                        : false

                  break
                }
              }
            })
          },
        )
      }
    },
  })

  return {
    isPending,
    vote: mutate,
  }
}
