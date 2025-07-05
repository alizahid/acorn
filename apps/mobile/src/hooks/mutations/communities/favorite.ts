import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { getIcon } from '~/components/common/icon'
import { updateCommunities } from '~/hooks/queries/communities/communities'
import { updateCommunity } from '~/hooks/queries/communities/community'
import { reddit } from '~/reddit/api'

type Variables = {
  favorite: boolean
  name: string
}

export function useFavorite() {
  const t = useTranslations('toasts.communities')

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('sr_name', variables.name)
      body.append('make_favorite', String(variables.favorite))

      await reddit({
        body,
        method: 'post',
        url: '/api/favorite',
      })
    },
    onMutate(variables) {
      updateCommunity(variables.name, (draft) => {
        draft.favorite = variables.favorite
      })

      updateCommunities(variables.name, (draft) => {
        draft.favorite = variables.favorite
      })
    },
    onSuccess(_data, variables) {
      toast.success(
        t(variables.favorite ? 'favorited' : 'unfavorited', {
          community: variables.name,
        }),
        {
          icon: getIcon({
            color: variables.favorite ? 'amber' : 'gray',
            name: 'Star',
            weight: variables.favorite ? 'fill' : 'regular',
          }),
        },
      )
    },
  })

  return {
    favorite: mutate,
    isPending,
  }
}
