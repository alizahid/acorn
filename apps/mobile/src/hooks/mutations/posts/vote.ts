import { useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'mutative'

import { type FeedQuery, type FeedType } from '~/hooks/queries/posts/feed'
import { TYPE_LINK } from '~/lib/const'
import { redditApi } from '~/lib/reddit'
import { useAuth } from '~/stores/auth'

type Variables = {
  direction: 1 | 0 | -1
  feedType: FeedType
  postId: string
}

export function useVote() {
  const queryClient = useQueryClient()

  const { accessToken, expired } = useAuth()

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      if (expired) {
        return
      }

      const body = new FormData()

      body.append('id', `${TYPE_LINK}${variables.postId}`)
      body.append('dir', String(variables.direction))

      await redditApi({
        accessToken,
        body,
        method: 'post',
        url: '/api/vote',
      })
    },
    onMutate(variables) {
      queryClient.setQueryData<FeedQuery>(
        ['feed', variables.feedType],
        (data) => {
          if (!data) {
            return data
          }

          return create(data, (draft) => {
            for (const page of draft.pages) {
              for (const item of page?.data.children ?? []) {
                if (item.data.id === variables.postId) {
                  item.data.ups =
                    item.data.ups -
                    (item.data.likes ? 1 : item.data.likes === null ? 0 : -1) +
                    variables.direction

                  item.data.likes =
                    variables.direction === 1
                      ? true
                      : variables.direction === 0
                        ? null
                        : false

                  break
                }
              }
            }
          })
        },
      )
    },
  })

  return {
    isPending,
    vote: mutate,
  }
}
