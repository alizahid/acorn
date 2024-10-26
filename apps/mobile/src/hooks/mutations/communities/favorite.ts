import { useMutation } from '@tanstack/react-query'

import { type CommunitiesQueryKey } from '~/hooks/queries/communities/communities'
import { type CommunityQueryKey } from '~/hooks/queries/communities/community'
import { queryClient } from '~/lib/query'
import { reddit } from '~/reddit/api'

type Variables = {
  favorite: boolean
  name: string
}

export function useFavorite() {
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
    async onSuccess(data, variables) {
      await queryClient.invalidateQueries({
        queryKey: [
          'community',
          {
            name: variables.name,
          },
        ] satisfies CommunityQueryKey,
      })

      void queryClient.invalidateQueries({
        queryKey: ['communities', {}] satisfies CommunitiesQueryKey,
      })
    },
  })

  return {
    favorite: mutate,
    isPending,
  }
}
