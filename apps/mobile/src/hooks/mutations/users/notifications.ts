import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { updateInbox, updateNotification } from '~/hooks/queries/user/inbox'
import { type UnreadQueryKey } from '~/hooks/queries/user/unread'
import { queryClient } from '~/lib/query'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { useAuth } from '~/stores/auth'

type MarkReadVariables = {
  id: string
  type: 'notification' | 'message'
}

export function useMarkAsRead() {
  const { accountId } = useAuth()

  const { isPending, mutate } = useMutation<unknown, Error, MarkReadVariables>({
    async mutationFn(variables) {
      const body = new FormData()

      body.append(
        'id',
        addPrefix(
          variables.id,
          variables.type === 'message' ? 'message' : 'comment',
        ),
      )

      await reddit({
        body,
        method: 'post',
        url: '/api/read_message',
      })
    },
    onMutate(variables) {
      updateNotification(variables.id, (draft) => {
        draft.data.new = false
      })

      queryClient.setQueryData<number, UnreadQueryKey>(
        [
          'unread',
          {
            accountId,
          },
        ],
        (previous) => (previous ?? 0) - 1,
      )
    },
  })

  return {
    isPending,
    mark: mutate,
  }
}

export function useMarkAllAsRead() {
  const t = useTranslations('toasts.notifications')

  const { accountId } = useAuth()

  const { isPending, mutate } = useMutation({
    async mutationFn() {
      await reddit({
        method: 'post',
        url: '/api/read_all_messages',
      })
    },
    onMutate() {
      updateInbox((item) => {
        item.data.new = false
      }, accountId)

      queryClient.setQueryData<number, UnreadQueryKey>(
        [
          'unread',
          {
            accountId,
          },
        ],
        0,
      )
    },
    onSuccess() {
      toast.success(t('markAllAsRead'))
    },
  })

  return {
    isPending,
    markAll: mutate,
  }
}
