import { useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'mutative'

import { type FeedQuery, type FeedType } from '~/hooks/queries/posts/feed'
import { TYPE_LINK } from '~/lib/const'
import { redditApi } from '~/lib/reddit'
import { useAuth } from '~/stores/auth'

type Variables = {
  action: 'save' | 'unsave'
  feedType: FeedType
  postId: string
}

export function useSave() {
  const queryClient = useQueryClient()

  const { accessToken, expired } = useAuth()

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      if (expired) {
        return
      }

      const body = new FormData()

      body.append('id', `${TYPE_LINK}${variables.postId}`)

      await redditApi({
        accessToken,
        body,
        method: 'post',
        url: `/api/${variables.action}`,
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
            let found = false

            for (const page of draft.pages) {
              if (found) {
                break
              }

              for (const item of page?.data.children ?? []) {
                if (item.data.id === variables.postId) {
                  item.data.saved = variables.action === 'save'

                  found = true

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
    save: mutate,
  }
}
