import { useMutation } from '@tanstack/react-query'
import { restorePurchases } from 'expo-iap'
import { toast } from 'sonner-native'

export function useRestore() {
  const { isPending, mutateAsync } = useMutation({
    async mutationFn(_variables, context) {
      await restorePurchases()

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
