import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type VideoSource } from 'expo-video'
import { create } from 'mutative'

import { getGif } from '~/lib/redgifs'

type Item = {
  expiresAt: Date
  source: VideoSource
}

type RedGifsQueryKey = ['redgifs']

type RedGifsData = Record<string, Item>

export function useRedGifs(id: string) {
  const queryClient = useQueryClient()

  const { data } = useQuery<RedGifsData, Error, RedGifsData, RedGifsQueryKey>({
    initialData: {},
    queryKey: ['redgifs'],
  })

  const { mutate } = useMutation<
    Item | undefined,
    Error,
    {
      id: string
    }
  >({
    async mutationFn(variables) {
      const cache = queryClient.getQueryData<RedGifsData>([
        'redgifs',
      ] satisfies RedGifsQueryKey)

      if (!cache) {
        return getGif(variables.id)
      }

      const exists = cache[variables.id] as Item | undefined

      if (exists && exists.expiresAt > new Date()) {
        return
      }

      return getGif(variables.id)
    },
    onSuccess(item, variables) {
      if (!item) {
        return
      }

      queryClient.setQueryData<RedGifsData>(
        ['redgifs'] satisfies RedGifsQueryKey,
        (previous) => {
          if (!previous) {
            return previous
          }

          return create(previous, (draft) => {
            draft[variables.id] = item
          })
        },
      )
    },
  })

  const item = data[id] as Item | undefined

  return {
    get: mutate,
    source: item?.source,
  }
}
