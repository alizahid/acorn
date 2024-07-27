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
  action: 'save' | 'unsave'
  commentId: string
  postId?: string
}

export function useCommentSave() {
  const queryClient = useQueryClient()

  const { accessToken, expired } = useAuth()

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      if (expired) {
        return
      }

      const body = new FormData()

      body.append('id', `${TYPE_COMMENT}${variables.commentId}`)

      await redditApi({
        accessToken,
        body,
        method: 'post',
        url: `/api/${variables.action}`,
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
                if (item.id === variables.commentId) {
                  item.saved = variables.action === 'save'

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
    save: mutate,
  }
}
