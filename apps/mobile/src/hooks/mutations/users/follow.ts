import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { getIcon } from '~/components/common/icon'
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
  const t = useTranslations('toasts.users')

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
    },
    async onSuccess(_data, variables) {
      await queryClient.invalidateQueries({
        queryKey: [
          'users',
          {
            name: variables.name,
          },
        ] satisfies ProfileQueryKey,
      })

      queryClient.invalidateQueries({
        queryKey: ['communities', {}] satisfies CommunitiesQueryKey,
      })

      toast.success(
        t(variables.action === 'follow' ? 'followed' : 'unfollowed', {
          user: variables.name,
        }),
        {
          icon: getIcon({
            color: variables.action === 'follow' ? 'green' : 'red',
            name:
              variables.action === 'follow'
                ? 'UserCirclePlus'
                : 'UserCircleMinus',
          }),
        },
      )
    },
  })

  return {
    follow: mutate,
    isPending,
  }
}
