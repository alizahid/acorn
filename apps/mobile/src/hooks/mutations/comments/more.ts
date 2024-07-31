import { useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'mutative'

import {
  type PostQueryData,
  type PostQueryKey,
} from '~/hooks/queries/posts/post'
import { REDDIT_URI, TYPE_LINK } from '~/lib/const'
import { redditApi } from '~/lib/reddit'
import { MoreCommentsSchema } from '~/schemas/reddit/comments'
import { useAuth } from '~/stores/auth'
import { transformComment } from '~/transformers/comment'

type Variables = {
  children: Array<string>
  id: string
  postId: string
}

export function useLoadMoreComments() {
  const queryClient = useQueryClient()

  const { accessToken, expired } = useAuth()

  const { isPending, mutate } = useMutation<
    MoreCommentsSchema | undefined,
    Error,
    Variables
  >({
    async mutationFn(variables) {
      if (expired) {
        return
      }

      const url = new URL('/api/morechildren', REDDIT_URI)

      url.searchParams.set('api_type', 'json')
      url.searchParams.set('threaded', 'false')
      url.searchParams.set('limit_children', 'true')
      url.searchParams.set('link_id', `${TYPE_LINK}${variables.postId}`)
      url.searchParams.set('children', variables.children.join(','))

      const response = await redditApi({
        accessToken,
        url,
      })

      return MoreCommentsSchema.parse(response)
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

          return create(previous, (draft) => {
            const index = draft.comments.findIndex(
              (item) => item.type === 'more' && item.data.id === variables.id,
            )

            if (index >= 0) {
              const comments = data.json.data.things.map((item) =>
                transformComment(item),
              )

              draft.comments.splice(index, 1, ...comments)
            }
          })
        },
      )
    },
  })

  return {
    isPending,
    loadMore: mutate,
  }
}
