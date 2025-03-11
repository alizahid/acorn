import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { getIcon } from '~/components/common/icon'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'

type Variables = {
  id: string
}

export function usePostRemove() {
  const t = useTranslations('toasts.posts')

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('id', addPrefix(variables.id, 'link'))

      await reddit({
        body,
        method: 'post',
        url: '/api/del',
      })
    },
    onMutate(variables) {
      updatePosts(variables.id, undefined, true)
    },
    onSuccess() {
      toast.success(t('deleted'), {
        icon: getIcon({
          color: 'green',
          name: 'Trash',
        }),
      })
    },
  })

  return {
    isPending,
    remove: mutate,
  }
}
