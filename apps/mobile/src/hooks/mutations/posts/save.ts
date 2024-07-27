import { useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'mutative'

import {
  type PostQueryData,
  type PostQueryKey,
} from '~/hooks/queries/posts/post'
import {
  type FeedType,
  type PostsQueryData,
  type PostsQueryKey,
  type TopInterval,
} from '~/hooks/queries/posts/posts'
import { TYPE_LINK } from '~/lib/const'
import { redditApi } from '~/lib/reddit'
import { useAuth } from '~/stores/auth'

type Variables = {
  action: 'save' | 'unsave'
  feedType?: FeedType
  interval?: TopInterval
  postId: string
  subreddit?: string
}

export function usePostSave() {
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
      queryClient.setQueryData<PostQueryData>(
        ['post', variables.postId] satisfies PostQueryKey,
        (data) => {
          if (!data) {
            return data
          }

          return create(data, (draft) => {
            draft.post.saved = variables.action === 'save'
          })
        },
      )

      if (variables.feedType) {
        queryClient.setQueryData<PostsQueryData>(
          [
            'posts',
            variables.feedType,
            variables.interval,
            variables.subreddit,
          ] satisfies PostsQueryKey,
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

                for (const item of page.posts) {
                  if (item.id === variables.postId) {
                    item.saved = variables.action === 'save'

                    found = true

                    break
                  }
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
