import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { type CommunitiesQueryKey } from '~/hooks/queries/communities/communities'
import { updateProfile } from '~/hooks/queries/user/profile'
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
    async mutationFn(variables, context) {
      const body = new URLSearchParams()

      body.append('sr', addPrefix(variables.id, 'subreddit'))
      body.append('action', variables.action === 'follow' ? 'sub' : 'unsub')

      await reddit({
        body,
        method: 'post',
        url: '/api/subscribe',
      })

      await context.client.invalidateQueries({
        queryKey: ['communities', {}] satisfies CommunitiesQueryKey,
      })
    },
    onMutate(variables) {
      updateProfile(variables.name, (draft) => {
        draft.subscribed = variables.action === 'follow'
      })
    },
    onSuccess(_data, variables) {
      toast.success(
        t(variables.action === 'follow' ? 'followed' : 'unfollowed', {
          user: variables.name,
        }),
        {
          icon: (
            <Icon
              name={
                variables.action === 'follow'
                  ? 'user-circle-plus'
                  : 'user-circle-minus'
              }
              uniProps={(theme) => ({
                color:
                  variables.action === 'follow'
                    ? theme.colors.green.accent
                    : theme.colors.red.accent,
              })}
            />
          ),
        },
      )
    },
  })

  return {
    follow: mutate,
    isPending,
  }
}
