import { useMutation } from '@tanstack/react-query'

import { updateCommunities } from '~/hooks/queries/communities/communities'
import { updateCommunity } from '~/hooks/queries/communities/community'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'

type Variables = {
  action: 'join' | 'leave'
  id: string
  name: string
}

export function useJoin() {
  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('sr', addPrefix(variables.id, 'subreddit'))
      body.append('action', variables.action === 'join' ? 'sub' : 'unsub')

      await reddit({
        body,
        method: 'post',
        url: '/api/subscribe',
      })
    },
    onMutate(variables) {
      updateCommunity(variables.name, (draft) => {
        draft.subscribed = variables.action === 'join'
      })

      updateCommunities(variables.name, (draft) => {
        draft.subscribed = variables.action === 'join'
      })
    },
  })

  return {
    isPending,
    join: mutate,
  }
}
