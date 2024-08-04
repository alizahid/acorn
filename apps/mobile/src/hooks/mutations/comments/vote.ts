import { useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'mutative'

import { updatePost } from '~/hooks/queries/posts/post'
import {
  type CommentsQueryData,
  type CommentsQueryKey,
} from '~/hooks/queries/user/comments'
import { addPrefix, redditApi } from '~/lib/reddit'
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

      body.append('id', addPrefix(variables.commentId, 'comment'))
      body.append('dir', String(variables.direction))

      await redditApi({
        accessToken,
        body,
        method: 'post',
        url: '/api/vote',
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
                  item.data.votes =
                    item.data.votes -
                    (item.data.liked ? 1 : item.data.liked === null ? 0 : -1) +
                    variables.direction

                  item.data.liked =
                    variables.direction === 1
                      ? true
                      : variables.direction === 0
                        ? null
                        : false

                  found = true

                  break
                }
              }
            }
          })
        },
      )

      if (variables.postId) {
        updatePost(variables.postId, (draft) => {
          for (const item of draft.comments) {
            if (item.type === 'reply' && item.data.id === variables.commentId) {
              item.data.votes =
                item.data.votes -
                (item.data.liked ? 1 : item.data.liked === null ? 0 : -1) +
                variables.direction

              item.data.liked =
                variables.direction === 1
                  ? true
                  : variables.direction === 0
                    ? null
                    : false

              break
            }
          }
        })
      }
    },
  })

  return {
    isPending,
    vote: mutate,
  }
}
