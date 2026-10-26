import { useQuery } from '@tanstack/react-query'
import {
  getAvailablePurchases,
  type Purchase,
  type PurchaseIOS,
} from 'expo-iap'

import { usePlans } from './plans'

export function useSubscribed() {
  const { plans } = usePlans()

  const { isLoading, data } = useQuery({
    enabled: Boolean(plans),
    async queryFn() {
      if (__DEV__) {
        return false
      }

      if (!plans?.length) {
        return true
      }

      const productIds = plans.map((product) => product.id)

      const purchases = await getAvailablePurchases()

      const purchase = purchases.find((item) =>
        productIds.includes(item.productId),
      )

      if (purchase) {
        const product = plans.find((item) => item.id === purchase.productId)

        return {
          createdAt: purchase.transactionDate,
          currency: product?.currency,
          id: product?.id,
          name: product?.title,
          price: product?.price,
          renewsAt: isPurchaseIOS(purchase)
            ? purchase.renewalInfoIOS?.renewalDate
            : null,
          type: product?.type,
        }
      }

      return false
    },
    queryKey: ['purchases', 'subscribed'],
  })

  return {
    isLoading,
    subscribed: Boolean(data),
    subscription: data,
  }
}

function isPurchaseIOS(purchase: Purchase): purchase is PurchaseIOS {
  return purchase.store === 'apple'
}
