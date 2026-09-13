import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { type CommunitiesQueryKey } from '~/hooks/queries/communities/communities'
import { updateCommunity } from '~/hooks/queries/communities/community'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'

type Variables = {
  action: 'join' | 'leave'
  id: string
  name: string
}

export function useJoin() {
  const t = useTranslations('toasts.communities')

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables, context) {
      const body = new URLSearchParams()

      body.append('sr', addPrefix(variables.id, 'subreddit'))
      body.append('action', variables.action === 'join' ? 'sub' : 'unsub')

      await reddit({
        body,
        method: 'post',
        url: '/api/subscribe',
      })

      context.client.invalidateQueries({
        queryKey: ['communities', {}] satisfies CommunitiesQueryKey,
      })
    },
    onMutate(variables) {
      updateCommunity(variables.name, (draft) => {
        draft.subscribed = variables.action === 'join'
      })
    },
    onSuccess(_data, variables) {
      toast.success(
        t(variables.action === 'join' ? 'joined' : 'left', {
          community: variables.name,
        }),
        {
          icon: (
            <Icon
              name={
                variables.action === 'join'
                  ? 'user-circle-plus'
                  : 'user-circle-minus'
              }
              uniProps={(theme) => ({
                color:
                  variables.action === 'join'
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
    isPending,
    join: mutate,
  }
}
