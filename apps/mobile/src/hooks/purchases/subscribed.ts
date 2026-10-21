import { useQuery } from '@tanstack/react-query'
import {
  fetchProducts,
  getAvailablePurchases,
  subscriptionStatusIOS,
} from 'expo-iap'

import { skus } from '~/lib/purchases'

export function useSubscribed() {
  const { isLoading, data } = useQuery({
    async queryFn() {
      if (__DEV__) {
        // return true
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

      if (purchases.some((item) => productIds.includes(item.productId))) {
        return true
      }

      const subscription = products.find((product) => product.type === 'subs')

      if (!subscription) {
        return false
      }

      const statuses = await subscriptionStatusIOS(subscription.id)

      return statuses.some(
        (status) =>
          status.state === 'subscribed' || status.state === 'inGracePeriod',
      )
    },
    queryKey: ['purchases', 'subscribed'],
  })

  return {
    isLoading,
    subscribed: data,
  }
}
