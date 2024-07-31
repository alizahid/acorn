import { useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'mutative'

import {
  type PostQueryData,
  type PostQueryKey,
} from '~/hooks/queries/posts/post'
import {
  type CommentsQueryData,
  type CommentsQueryKey,
} from '~/hooks/queries/user/comments'
import { addPrefix, redditApi } from '~/lib/reddit'
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

      body.append('id', addPrefix(variables.commentId, 'comment'))

      await redditApi({
        accessToken,
        body,
        method: 'post',
        url: `/api/${variables.action}`,
      })
    },
    onMutate(variables) {
      queryClient.setQueryData<CommentsQueryData>(
        ['comments'] satisfies CommentsQueryKey,
        (previous) => {
          if (!previous) {
            return previous
          }

          return create(previous, (draft) => {
            let found = false

            for (const page of draft.pages) {
              if (found) {
                break
              }

              for (const item of page.comments) {
                if (
                  item.type === 'reply' &&
                  item.data.id === variables.commentId
                ) {
                  item.data.saved = variables.action === 'save'

                  found = true

                  break
                }
              }
            }
          })
        },
      )
      if (variables.postId) {
        queryClient.setQueryData<PostQueryData>(
          ['post', variables.postId] satisfies PostQueryKey,
          (data) => {
            if (!data) {
              return data
            }

            return create(data, (draft) => {
              for (const item of draft.comments) {
                if (
                  item.type === 'reply' &&
                  item.data.id === variables.commentId
                ) {
                  item.data.saved = variables.action === 'save'

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
