import { type Notification } from '@acorn/reddit'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { updateNotification } from '~/hooks/queries/user/notifications'
import { type UnreadQueryKey } from '~/hooks/queries/user/unread'
import { createApi } from '~/reddit/api'
import { useAuth } from '~/stores/auth'

type MarkReadVariables = Pick<Notification, 'group' | 'id'>

export function useMarkAsRead() {
  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const { isPending, mutate } = useMutation<unknown, Error, MarkReadVariables>({
    async mutationFn(variables) {
      const reddit = await createApi()

      await reddit.inbox.markRead(variables)
    },
    onMutate(variables, context) {
      updateNotification(variables.id, (draft) => {
        draft.new = false
      })

      context.client.setQueryData<number, UnreadQueryKey>(
        [
          'unread',
          {
            accountId,
          },
        ],
        (previous) => Math.max((previous ?? 0) - 1, 0),
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

  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const { isPending, mutate } = useMutation({
    async mutationFn() {
      const reddit = await createApi()

      await reddit.inbox.markAllRead()
    },
    onMutate(_variables, context) {
      context.client.setQueryData<number, UnreadQueryKey>(
        [
          'unread',
          {
            accountId,
          },
        ],
        0,
      )
    },
    onSuccess(_data, _variables, _result, context) {
      context.client.invalidateQueries({
        queryKey: ['notifications'],
      })

      toast.success(t('markAllAsRead'))
    },
  })

  return {
    isPending,
    markAll: mutate,
  }
}
