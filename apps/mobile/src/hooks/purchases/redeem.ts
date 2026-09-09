import { useMutation } from '@tanstack/react-query'
import { endConnection, initConnection, openRedeemOfferCode } from 'expo-iap'
import { toast } from 'sonner-native'

import { useSubscribe } from './subscribe'

export function useRedeem() {
  const { subscribe, isPending: subscribing } = useSubscribe()

  const { isPending, mutateAsync } = useMutation({
    async mutationFn() {
      await initConnection()

      const purchase = await openRedeemOfferCode()

      if (!purchase) {
        return
      }

      await subscribe({
        planId: purchase.id,
      })
    },
    onError(error) {
      toast.error(error.message)
    },
    async onSettled() {
      await endConnection()
    },
  })

  return {
    isPending: isPending || subscribing,
    redeem: mutateAsync,
  }
}
