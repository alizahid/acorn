import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { isComment } from '~/lib/guards'
import { prepareMarkdown } from '~/lib/markdown'
import { addPrefix } from '~/lib/reddit'
import { createApi } from '~/reddit/api'

type Variables = {
  body: string
  id: string
  postId?: string
}

export function useCommentEdit() {
  const t = useTranslations('toasts.comments')

  const { isPending, mutateAsync } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const reddit = await createApi()

      await reddit.comments.edit({
        body: prepareMarkdown(variables.body),
        id: addPrefix(variables.id, 'comment'),
      })
    },
    onError(error) {
      toast.error(error.message || t('error'))
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
    onSuccess() {
      toast.success(t('updated'))
    },
  })

  return {
    edit: mutateAsync,
    isPending,
  }
}
