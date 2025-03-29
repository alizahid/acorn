import { useQuery } from '@tanstack/react-query'
import { compact } from 'lodash'

import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { MessagesSchema } from '~/schemas/messages'
import { useAuth } from '~/stores/auth'
import { transformMessage } from '~/transformers/message'
import { type Message } from '~/types/message'

export type MessagesQueryKey = [
  'messages',
  {
    accountId?: string
    id: string
  },
]

export type MessagesQueryData = Array<Message>

export function useMessages(id: string) {
  const { accountId } = useAuth()

  const { data, isLoading, refetch } = useQuery<
    MessagesQueryData,
    Error,
    MessagesQueryData,
    MessagesQueryKey
  >({
    enabled: Boolean(accountId),
    async queryFn() {
      const url = new URL('/message/messages', REDDIT_URI)

      url.searchParams.set('after', addPrefix(id, 'message'))

      const payload = await reddit({
        url,
      })

      const response = MessagesSchema.parse(payload)

      const message = response.data.children.find((item) => {
        if (item.data.id === id) {
          return true
        }

        if (typeof item.data.replies === 'object') {
          return item.data.replies.data.children.find(
            (reply) => reply.data.id === id,
          )
        }

        return false
      })

      if (message) {
        const first = transformMessage(message)

        return compact([
          first,
          ...(first.replies ? first.replies : []),
        ]).reverse()
      }

      return []
    },
    queryKey: [
      'messages',
      {
        accountId,
        id,
      },
    ],
  })

  return {
    isLoading,
    messages: data,
    refetch,
  }
}
