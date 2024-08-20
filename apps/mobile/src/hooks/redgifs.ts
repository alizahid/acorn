import { useQuery } from '@tanstack/react-query'
import { differenceInMilliseconds } from 'date-fns'

import { getGif, type Gif } from '~/lib/redgifs'

type RedGifsQueryKey = [
  'redgifs',
  {
    id: string
  },
]

type RedGifsData = Gif

export function useRedGifs(id: string) {
  const { data, isLoading } = useQuery<
    RedGifsData | undefined,
    Error,
    RedGifsData,
    RedGifsQueryKey
  >({
    gcTime: 60 * 60 * 24,
    queryFn() {
      return getGif(id)
    },
    queryKey: [
      'redgifs',
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
