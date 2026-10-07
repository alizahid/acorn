import { useQuery } from '@tanstack/react-query'
import { fetchProducts, getActiveSubscriptions } from 'expo-iap'

export function useSubscribed() {
  const { isLoading, data } = useQuery({
    async queryFn() {
      if (__DEV__) {
        // return true
      }

      const products = await fetchProducts({
        skus: ['monthly', 'yearly', 'lifetime'],
        type: 'all',
      })

      if (!products?.length) {
        return true
      }

      const productIds = products.map((product) => product.id)

      const subscriptions = await getActiveSubscriptions()

      return subscriptions.some((item) => productIds.includes(item.productId))
    },
    queryKey: ['purchases', 'subscribed'],
  })

  return {
    isLoading,
    subscribed: data,
  }
}
