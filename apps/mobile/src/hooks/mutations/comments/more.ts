import { useMutation } from '@tanstack/react-query'

import { updatePost } from '~/hooks/queries/posts/post'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { MoreCommentsSchema } from '~/schemas/comments'
import { transformComment } from '~/transformers/comment'
import { type CommentSort } from '~/types/sort'

type Variables = {
  children: Array<string>
  id: string
  postId: string
  sort: CommentSort
}

export function useLoadMoreComments() {
  const { isPending, mutate } = useMutation<
    MoreCommentsSchema,
    Error,
    Variables
  >({
    async mutationFn(variables) {
      const url = new URL('/api/morechildren', REDDIT_URI)

      url.searchParams.set('api_type', 'json')
      url.searchParams.set('link_id', addPrefix(variables.postId, 'link'))
      url.searchParams.set('sort', variables.sort)
      url.searchParams.set(
        'children',
        variables.children.slice(0, 50).join(','),
      )
      url.searchParams.set('limit_children', 'true')

      const response = await reddit({
        url,
      })

      return MoreCommentsSchema.parse(response)
    },
    onSuccess(data, variables) {
      updatePost(variables.postId, (draft) => {
        const index = draft.comments.findIndex(
          (item) => item.type === 'more' && item.data.id === variables.id,
        )

        if (index >= 0) {
          const comments = data.json.data.things.map((item) =>
            transformComment(item),
          )

          const more = draft.comments[index]

          if (more?.type === 'more') {
            more.data.children = more.data.children.slice(50)

            if (more.data.children.length > 0) {
              draft.comments.splice(index, 1, ...comments, more)

              return
            }
          }

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
