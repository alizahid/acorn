import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { isComment } from '~/lib/guards'
import { enrichedToMarkdown } from '~/lib/markdown'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { CreateCommentSchema } from '~/schemas/comments'

type Variables = {
  body: string
  id: string
  postId?: string
}

export function useCommentEdit() {
  const t = useTranslations('toasts.comments')

  const { isPending, mutateAsync } = useMutation<
    CreateCommentSchema,
    Error,
    Variables
  >({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('api_type', 'json')
      body.append('text', enrichedToMarkdown(variables.body))
      body.append('thing_id', addPrefix(variables.id, 'comment'))

      const response = await reddit({
        body,
        method: 'post',
        url: '/api/editusertext',
      })

      return CreateCommentSchema.parse(response)
    },
    onMutate(variables) {
      updatePosts(variables.id, (draft) => {
        if (isComment(draft) && draft.type === 'reply') {
          draft.data.body = variables.body
        }
      })

      if (variables.postId) {
        updatePost(variables.postId, (draft) => {
          const exists = draft.comments.find(
            (comment) => comment.data.id === variables.id,
          )

          if (exists?.type === 'reply') {
            exists.data.body = variables.body
          }
        })
      }
    },
    onSuccess(data) {
      if (data.json.errors.length > 0) {
        const error = data.json.errors[0]?.[1] ?? t('error')

        toast.error(error)

        throw new Error(error)
      }

      toast.success(t('updated'))
    },
  })

  return {
    edit: mutateAsync,
    isPending,
  }
}
