import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { updateCommunities } from '~/hooks/queries/communities/communities'
import { updateProfile } from '~/hooks/queries/user/profile'
import { addPrefix } from '~/lib/reddit'
import { createApi } from '~/reddit/api'

type Variables = {
  favorite: boolean
  // the profile's id (t5_…)
  id: string
  name: string
}

export function useFavorite() {
  const t = useTranslations('toasts.users')

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const reddit = await createApi()

      await reddit.users[variables.favorite ? 'favorite' : 'unfavorite']({
        id: addPrefix(variables.id, 'subreddit'),
      })
    },
    onMutate(variables) {
      updateProfile(variables.name, (draft) => {
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
