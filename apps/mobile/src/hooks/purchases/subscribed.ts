import { useQuery } from '@tanstack/react-query'
import { fetchProducts, getActiveSubscriptions } from 'expo-iap'
import { isTestFlight } from 'expo-testflight'

export function useSubscribed() {
  const { isLoading, data } = useQuery({
    async queryFn() {
      if (__DEV__ || isTestFlight) {
        // return true
      }

      const products = await fetchProducts({
        skus: ['monthly'],
        type: 'subs',
      })

      const product = products?.[0]

      if (!product) {
        return true
      }

      const subscriptions = await getActiveSubscriptions()

      return subscriptions.some(
        (item) => item.productId === product.id && item.isActive,
      )
    },
    queryKey: ['purchases', 'subscribed'],
  })

  return {
    isLoading,
    subscribed: data,
  }
}
