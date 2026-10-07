import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from 'expo-iap'

export function usePlans() {
  const { isLoading, data } = useQuery({
    queryFn() {
      return fetchProducts({
        skus: ['monthly', 'yearly', 'lifetime'],
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
