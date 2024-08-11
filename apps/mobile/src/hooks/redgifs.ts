import { useMutation, useQuery } from '@tanstack/react-query'
import { type VideoSource } from 'expo-video'
import { create } from 'mutative'

import { queryClient } from '~/lib/query'
import { getGif } from '~/lib/redgifs'

type Item = {
  expiresAt: Date
  source: VideoSource
}

type RedGifsData = Record<string, Item>

export function useRedGifs(id: string) {
  const queryKey = ['redgifs']

  const { data } = useQuery<RedGifsData>({
    initialData: {},
    queryKey,
  })

  const { isPending, mutate } = useMutation<Item | undefined, Error, string>({
    async mutationFn(variables) {
      const cache = queryClient.getQueryData<RedGifsData>(queryKey)

      if (!cache) {
        return getGif(variables)
      }

      const exists = cache[variables]

      if (exists && exists.expiresAt > new Date()) {
        return
      }

      return getGif(variables)
    },
    onSuccess(item, variables) {
      if (!item) {
        return
      }

      queryClient.setQueryData<RedGifsData>(queryKey, (previous) => {
        if (!previous) {
          return previous
        }

        return create(previous, (draft) => {
          draft[variables] = item
        })
      })
    },
  })

  return {
    data: data[id],
    get: mutate,
    isPending,
  }
}
