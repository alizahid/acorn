import { useMutation } from '@tanstack/react-query'
import {
  finishTransaction,
  isUserCancelledError,
  openRedeemOfferCode,
} from 'expo-iap'

import { verifyPurchase } from '~/lib/purchases'
import { toast } from '~/lib/toast'

export function useRedeem() {
  const { isPending, mutateAsync } = useMutation({
    async mutationFn(_variables, context) {
      const purchase = await openRedeemOfferCode()

      if (!purchase) {
        return
      }

      if (await verifyPurchase(purchase)) {
        await finishTransaction({
          purchase,
        })
      }

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
    redeem: mutateAsync,
  }
}
