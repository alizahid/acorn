import { useQuery } from '@tanstack/react-query'
import {
  getAvailablePurchases,
  type Purchase,
  type PurchaseIOS,
} from 'expo-iap'

import { verifyPurchase } from '~/lib/purchases'

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

      const candidates = purchases.filter((item) =>
        productIds.includes(item.productId),
      )

      const verified = await Promise.all(candidates.map(verifyPurchase))

      const purchase = candidates.find((_item, index) => verified[index])

      if (purchase) {
        const product = plans.find((item) => item.id === purchase.productId)

        if (product) {
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
