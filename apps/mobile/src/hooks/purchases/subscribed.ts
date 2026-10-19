import { useQuery } from '@tanstack/react-query'
import { fetchProducts, getAvailablePurchases } from 'expo-iap'

import { skus } from '~/lib/purchases'

export function useSubscribed() {
  const { isLoading, data } = useQuery({
    async queryFn() {
      if (__DEV__) {
        return true
      }

      const products = await fetchProducts({
        skus,
        type: 'all',
      })

      if (!products?.length) {
        return true
      }

      const productIds = products.map((product) => product.id)

      const purchases = await getAvailablePurchases()

      return purchases.some((item) => productIds.includes(item.productId))
    },
    queryKey: ['purchases', 'subscribed'],
  })

  return {
    isLoading,
    subscribed: data,
  }
}
