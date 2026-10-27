import { useMutation } from '@tanstack/react-query'
import {
  finishTransaction,
  getAvailablePurchases,
  isUserCancelledError,
  restorePurchases,
} from 'expo-iap'
import { toast } from 'sonner-native'

import { verifyPurchase } from '~/lib/purchases'

export function useRestore() {
  const { isPending, mutateAsync } = useMutation({
    async mutationFn(_variables, context) {
      await restorePurchases()

      const purchases = await getAvailablePurchases()

      await Promise.all(
        purchases.map(async (purchase) => {
          if (await verifyPurchase(purchase)) {
            await finishTransaction({
              purchase,
            })
          }
        }),
      )

      await context.client.invalidateQueries({
        queryKey: ['purchases', 'subscribed'],
      })
    },
    onError(error) {
      if (!isUserCancelledError(error)) {
        toast.error(error.message)
      }
    },
  })

  return {
    isPending,
    restore: mutateAsync,
  }
}
