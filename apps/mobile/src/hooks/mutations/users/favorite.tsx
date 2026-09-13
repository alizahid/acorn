import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { updateCommunities } from '~/hooks/queries/communities/communities'
import { updateProfile } from '~/hooks/queries/user/profile'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'

type Variables = {
  favorite: boolean
  name: string
  userId: string
}

export function useFavorite() {
  const t = useTranslations('toasts.users')

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      await Promise.all([
        (async () => {
          const body = new URLSearchParams()

          body.append('sr_name', `u_${variables.name}`)
          body.append('make_favorite', String(variables.favorite))

          await reddit({
            body,
            method: 'post',
            url: '/api/favorite',
          })
        })(),
        (async () => {
          const body = new URLSearchParams()

          body.append('api_type', 'json')
          body.append('container', addPrefix(variables.userId, 'account'))
          body.append('name', variables.name)
          body.append('type', 'friend')

          await reddit({
            body,
            method: 'post',
            url: variables.favorite ? '/api/friend' : '/api/unfriend',
          })
        })(),
      ])
    },
    onMutate(variables) {
      updateProfile(variables.name, (draft) => {
        draft.friend = variables.favorite
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
          icon: (
            <Icon
              name={variables.favorite ? 'star-fill' : 'star'}
              uniProps={(theme) => ({
                color: variables.favorite
                  ? theme.colors.amber.accent
                  : theme.colors.gray.accent,
              })}
            />
          ),
        },
      )
    },
  })

  return {
    favorite: mutate,
    isPending,
  }
}
