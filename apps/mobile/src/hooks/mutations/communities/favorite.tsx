import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { updateCommunities } from '~/hooks/queries/communities/communities'
import { updateCommunity } from '~/hooks/queries/communities/community'
import { addPrefix } from '~/lib/reddit'
import { createApi } from '~/reddit/api'

type Variables = {
  favorite: boolean
  id: string
  name: string
}

export function useFavorite() {
  const t = useTranslations('toasts.communities')

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const reddit = await createApi()

      await reddit.communities[variables.favorite ? 'favorite' : 'unfavorite']({
        id: addPrefix(variables.id, 'subreddit'),
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
