import { useMutation } from '@tanstack/react-query'

import { updateInbox, updateNotification } from '~/hooks/queries/user/inbox'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { useAuth } from '~/stores/auth'

type MarkReadVariables = {
  id: string
  type: 'notification' | 'message'
}

export function useMarkAsRead() {
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
      updateInbox((item) => {
        item.data.new = false
      }, accountId)
    },
  })

  return {
    isPending,
    markAll: mutate,
  }
}
