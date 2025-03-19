import { useQuery } from '@tanstack/react-query'
import { differenceInMilliseconds } from 'date-fns'

import { getGif, type Gif } from '~/lib/red-gifs'
import { type Undefined } from '~/types'

type RedGifsQueryKey = [
  'red-gifs',
  {
    id: string
  },
]

type RedGifsData = Gif

export function useRedGifs(id: string) {
  const { data, isLoading } = useQuery<
    Undefined<RedGifsData>,
    Error,
    RedGifsData,
    RedGifsQueryKey
  >({
    networkMode: 'offlineFirst',
    queryFn() {
      return getGif(id)
    },
    queryKey: [
      'red-gifs',
      {
        id,
      },
    ],
    staleTime({ state }) {
      if (!state.data) {
        return 0
      }

      const difference = differenceInMilliseconds(
        state.data.expiresAt,
        new Date(),
      )

      if (difference > 0) {
        return difference
      }

      return 0
    },
  })

  return {
    gif: data,
    isLoading,
  }
}
