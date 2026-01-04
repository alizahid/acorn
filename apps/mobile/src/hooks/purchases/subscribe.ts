import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'

import { purchases } from '~/lib/purchases'

export function useSubscribe() {
  const { isPending, mutateAsync } = useMutation({
    async mutationFn(_variables, context) {
      const offerings = await purchases.getOfferings()

      const item = offerings.current?.availablePackages[0]

      if (!item) {
        return
      }

      await purchases.purchasePackage(item)

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
    subscribe: mutateAsync,
  }
}
