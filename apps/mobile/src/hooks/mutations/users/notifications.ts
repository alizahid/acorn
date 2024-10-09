import { useMutation } from '@tanstack/react-query'

import {
  updateNotification,
  updateNotifications,
} from '~/hooks/queries/user/notifications'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { useAuth } from '~/stores/auth'

type MarkReadVariables = {
  id: string
}

export function useMarkAsRead() {
  const { isPending, mutate } = useMutation<unknown, Error, MarkReadVariables>({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('id', addPrefix(variables.id, 'comment'))

      await reddit({
        body,
        method: 'post',
        url: '/api/read_message',
      })
    },
    onMutate(variables) {
      updateNotification(variables.id, (draft) => {
        draft.new = true
      })
    },
  })

  return {
    isPending,
    mark: mutate,
  }
}

export function useMarkAllAsRead() {
  const { accountId } = useAuth()

  const { isPending, mutate } = useMutation({
    async mutationFn() {
      await reddit({
        method: 'post',
        url: '/api/read_all_messages',
      })
    },
    onMutate() {
      updateNotifications(accountId)
    },
  })

  return {
    isPending,
    markAll: mutate,
  }
}
