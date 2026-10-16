import { useMutation } from '@tanstack/react-query'
import { finishTransaction, openRedeemOfferCode } from 'expo-iap'
import { toast } from 'sonner-native'

export function useRedeem() {
  const { isPending, mutateAsync } = useMutation({
    async mutationFn(_variables, context) {
      const purchase = await openRedeemOfferCode()

      if (purchase) {
        await finishTransaction({
          purchase,
        })
      }

      await context.client.invalidateQueries({
        queryKey: ['purchases', 'subscribed'],
      })
    },
    onError(error) {
      toast.error(error.message)
    },
  })

  return {
    isPending,
    redeem: mutateAsync,
  }
}
