import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'

import { purchases } from '~/lib/purchases'

export function useRestore() {
  const { isPending, mutateAsync } = useMutation({
    async mutationFn(_variables, context) {
      await purchases.restorePurchases()

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
    restore: mutateAsync,
  }
}
