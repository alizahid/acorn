import { createId } from '@paralleldrive/cuid2'
import { useMutation } from '@tanstack/react-query'
import { create } from 'mutative'
import { useShallow } from 'zustand/react/shallow'

import {
  type MessagesQueryData,
  type MessagesQueryKey,
} from '~/hooks/queries/user/messages'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { useAuth } from '~/stores/auth'
import { type Message } from '~/types/message'

type Variables = {
  threadId: string
  text: string
  user: string
}

export function useReply() {
  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const body = new URLSearchParams()

      body.append('api_type', 'json')
      body.append('thing_id', addPrefix(variables.threadId, 'message'))
      body.append('text', variables.text)

      await reddit({
        body,
        method: 'post',
        url: '/api/comment',
      })
    },
    onMutate(variables, context) {
      context.client.setQueryData<MessagesQueryData, MessagesQueryKey>(
        [
          'messages',
          {
            accountId,
          },
        ],
        (previous) =>
          create(previous, (draft) => {
            loop: for (const page of draft?.pages ?? []) {
              for (const item of page.items) {
                if (item.id === variables.threadId) {
                  const now = new Date()

                  const next: Message = {
                    body: `<p>${variables.text}</p>`,
                    createdAt: now,
                    from: accountId!,
                    id: createId(),
                    new: false,
                    to: variables.user,
                    updatedAt: now,
                  }

                  if (item.replies) {
                    item.replies.push(next)
                  } else {
                    item.replies = [next]
                  }

                  item.updatedAt = now

                  break loop
                }
              }
            }
          }),
      )

      context.client.invalidateQueries({
        queryKey: [
          'thread',
          {
            id: variables.threadId,
          },
        ],
      })
    },
  })

  return {
    createReply: mutate,
    isPending,
  }
}
