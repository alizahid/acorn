import { useMutation } from '@tanstack/react-query'

import { updatePost } from '~/hooks/queries/posts/post'
import { addPrefix, REDDIT_URI, redditApi } from '~/lib/reddit'
import { MoreCommentsSchema } from '~/schemas/comments'
import { useAuth } from '~/stores/auth'
import { transformComment } from '~/transformers/comment'

type Variables = {
  children: Array<string>
  id: string
  postId: string
}

export function useLoadMoreComments() {
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
      url.searchParams.set('link_id', addPrefix(variables.postId, 'link'))
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

      updatePost(variables.postId, (draft) => {
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
  })

  return {
    isPending,
    loadMore: mutate,
  }
}
