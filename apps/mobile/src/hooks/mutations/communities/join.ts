import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { getIcon } from '~/components/common/icon'
import { type CommunitiesQueryKey } from '~/hooks/queries/communities/communities'
import { updateCommunity } from '~/hooks/queries/communities/community'
import { queryClient } from '~/lib/query'
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
    },
    onSuccess(_data, variables) {
      queryClient.invalidateQueries({
        queryKey: ['communities', {}] satisfies CommunitiesQueryKey,
      })

      toast.success(
        t(variables.action === 'join' ? 'joined' : 'left', {
          community: variables.name,
        }),
        {
          icon: getIcon({
            color: variables.action === 'join' ? 'green' : 'red',
            name:
              variables.action === 'join'
                ? 'UserCirclePlus'
                : 'UserCircleMinus',
          }),
        },
      )
    },
  })

  return {
    isPending,
    join: mutate,
  }
}
