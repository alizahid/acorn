import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from 'expo-iap'

import { skus } from '~/lib/purchases'

export function usePlans() {
  const { isLoading, data } = useQuery({
    queryFn() {
      return fetchProducts({
        skus,
        type: 'all',
      })
    },
    queryKey: ['purchases', 'plans'],
  })

  return {
    isLoading,
    plans: data,
  }
}
