import { useMutation } from '@tanstack/react-query'

import { type CommunitiesQueryKey } from '~/hooks/queries/communities/communities'
import { type CommunityQueryKey } from '~/hooks/queries/communities/community'
import { queryClient } from '~/lib/query'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { useAuth } from '~/stores/auth'

type Variables = {
  action: 'join' | 'leave'
  id: string
  name: string
}

export function useJoin() {
  const { expired } = useAuth()

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      if (expired) {
        return
      }

      const body = new FormData()

      body.append('sr', addPrefix(variables.id, 'subreddit'))
      body.append('action', variables.action === 'join' ? 'sub' : 'unsub')

      await reddit({
        body,
        method: 'post',
        url: '/api/subscribe',
      })

      await queryClient.invalidateQueries({
        queryKey: [
          'community',
          {
            name: variables.name,
          },
        ] satisfies CommunityQueryKey,
      })

      void queryClient.invalidateQueries({
        queryKey: ['communities', {}] satisfies CommunitiesQueryKey,
      })
    },
  })

  return {
    isPending,
    join: mutate,
  }
}
