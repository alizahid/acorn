import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'

type Variables = {
  id: string
  postId?: string
}

export function useCommentRemove() {
  const t = useTranslations('toasts.comments')

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('id', addPrefix(variables.id, 'comment'))

      await reddit({
        body,
        method: 'post',
        url: '/api/del',
      })
    },
    onMutate(variables) {
      updatePosts(variables.id, undefined, true)

      if (variables.postId) {
        updatePost(variables.postId, (draft) => {
          draft.comments = draft.comments.filter(
            (comment) => comment.data.id !== variables.id,
          )
        })
      }
    },
    onSuccess() {
      toast.success(t('deleted'), {
        icon: (
          <Icon
            name="trash"
            uniProps={(theme) => ({
              tintColor: theme.colors.green.accent,
            })}
          />
        ),
      })
    },
  })

  return {
    isPending,
    remove: mutate,
  }
}
