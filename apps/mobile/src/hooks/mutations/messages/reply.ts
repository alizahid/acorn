import { createId } from '@paralleldrive/cuid2'
import { useMutation } from '@tanstack/react-query'

import {
  type MessagesQueryData,
  type MessagesQueryKey,
} from '~/hooks/queries/user/messages'
import { queryClient } from '~/lib/query'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { useAuth } from '~/stores/auth'

type Variables = {
  id: string
  text: string
  user: string
}

export function useReply() {
  const { accountId } = useAuth()

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('api_type', 'json')
      body.append('thing_id', addPrefix(variables.id, 'message'))
      body.append('text', variables.text)

      await reddit({
        body,
        method: 'post',
        url: '/api/comment',
      })
    },
    onMutate(variables) {
      queryClient.setQueryData<MessagesQueryData, MessagesQueryKey>(
        [
          'messages',
          {
            accountId,
            id: variables.id,
          },
        ],
        (previous) => {
          if (!previous) {
            return previous
          }

          return [
            {
              author: accountId!,
              body: variables.text,
              createdAt: new Date(),
              id: createId(),
              new: false,
              subject: variables.text,
            },
            ...previous,
          ] satisfies MessagesQueryData
        },
      )
    },
  })

  return {
    createReply: mutate,
    isPending,
  }
}
