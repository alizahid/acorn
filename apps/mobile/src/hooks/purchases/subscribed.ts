import { useQuery } from '@tanstack/react-query'
import {
  fetchProducts,
  getAvailablePurchases,
  type Purchase,
  type PurchaseIOS,
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

      const purchase = purchases.find((item) =>
        productIds.includes(item.productId),
      )

      if (purchase) {
        const product = products.find((item) => item.id === purchase.productId)

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
