import { useMutation } from '@tanstack/react-query'
import { finishTransaction, requestPurchase } from 'expo-iap'
import { useRouter } from 'expo-router'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

type Variables = {
  planId: string
}

export function useSubscribe() {
  const router = useRouter()

  const t = useTranslations('hook.purchases.subscribe')

  const { isPending, mutateAsync } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables, context) {
      const purchases = await requestPurchase({
        request: {
          apple: {
            sku: variables.planId,
          },
        },
        type: 'subs',
      })

      if (!purchases) {
        throw new Error(t('error'))
      }

      if (Array.isArray(purchases)) {
        await Promise.all(
          purchases.map((purchase) =>
            finishTransaction({
              purchase,
            }),
          ),
        )
      } else {
        await finishTransaction({
          purchase: purchases,
        })
      }

      await context.client.invalidateQueries({
        queryKey: ['purchases', 'subscribed'],
      })
    },
    onError(error) {
      toast.error(error.message)
    },
    onSuccess() {
      router.dismiss()
    },
  })

  return {
    isPending,
    subscribe: mutateAsync,
  }
}
