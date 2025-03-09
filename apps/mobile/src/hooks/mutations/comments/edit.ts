import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { updatePost } from '~/hooks/queries/posts/post'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'

type Variables = {
  body: string
  id: string
  postId?: string
}

export function useCommentEdit() {
  const t = useTranslations('toasts.comments')

  const { isPending, mutateAsync } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('api_type', 'json')
      body.append('text', variables.body)
      body.append('thing_id', addPrefix(variables.id, 'comment'))

      await reddit({
        body,
        method: 'post',
        url: '/api/editusertext',
      })
    },
    onMutate(variables) {
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
    onSuccess() {
      toast.success(t('updated'))
    },
  })

  return {
    edit: mutateAsync,
    isPending,
  }
}
