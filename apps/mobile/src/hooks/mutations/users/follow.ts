import { useMutation } from '@tanstack/react-query'

import { type CommunitiesQueryKey } from '~/hooks/queries/communities/communities'
import { type ProfileQueryKey } from '~/hooks/queries/user/profile'
import { queryClient } from '~/lib/query'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'

type Variables = {
  action: 'follow' | 'unfollow'
  id: string
  name: string
}

export function useFollow() {
  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('sr', addPrefix(variables.id, 'subreddit'))
      body.append('action', variables.action === 'follow' ? 'sub' : 'unsub')

      await reddit({
        body,
        method: 'post',
        url: '/api/subscribe',
      })

      await queryClient.invalidateQueries({
        queryKey: [
          'users',
          {
            name: variables.name,
          },
        ] satisfies ProfileQueryKey,
      })

      void queryClient.invalidateQueries({
        queryKey: ['communities', {}] satisfies CommunitiesQueryKey,
      })
    },
  })

  return {
    follow: mutate,
    isPending,
  }
}
