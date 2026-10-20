import { useMutation } from '@tanstack/react-query'
import { isUserCancelledError, restorePurchases } from 'expo-iap'
import { toast } from 'sonner-native'

export function useRestore() {
  const { isPending, mutateAsync } = useMutation({
    async mutationFn(_variables, context) {
      try {
        await restorePurchases()
      } catch (error) {
        await context.client.invalidateQueries({
          queryKey: ['purchases', 'subscribed'],
        })

        if (!context.client.getQueryData(['purchases', 'subscribed'])) {
          throw error
        }

        return
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
    restore: mutateAsync,
  }
}
