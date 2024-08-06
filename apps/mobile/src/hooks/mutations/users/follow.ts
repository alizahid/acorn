import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type CommunitiesQueryKey } from '~/hooks/queries/communities/communities'
import { type ProfileQueryKey } from '~/hooks/queries/user/profile'
import { addPrefix, redditApi } from '~/lib/reddit'
import { useAuth } from '~/stores/auth'

type Variables = {
  action: 'follow' | 'unfollow'
  id: string
  name: string
}

export function useFollow() {
  const { accessToken, expired } = useAuth()

  const queryClient = useQueryClient()

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      if (expired) {
        return
      }

      const body = new FormData()

      body.append('sr', addPrefix(variables.id, 'subreddit'))
      body.append('action', variables.action === 'follow' ? 'sub' : 'unsub')

      await redditApi({
        accessToken,
        body,
        method: 'post',
        url: '/api/subscribe',
      })

      await queryClient.invalidateQueries({
        queryKey: ['users', variables.name] satisfies ProfileQueryKey,
      })

      void queryClient.invalidateQueries({
        queryKey: ['communities'] satisfies CommunitiesQueryKey,
      })
    },
  })

  return {
    follow: mutate,
    isPending,
  }
}
