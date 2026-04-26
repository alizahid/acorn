import { useMutation } from '@tanstack/react-query'
import {
  finishTransaction,
  type ProductSubscriptionIOS,
  requestPurchase,
} from 'expo-iap'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

type Variables = {
  plan: ProductSubscriptionIOS
}

export function useSubscribe() {
  const t = useTranslations('hook.purchases.subscribe')

  const { isPending, mutateAsync } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables, context) {
      const purchases = await requestPurchase({
        request: {
          apple: {
            sku: variables.plan.id,
          },
        },
        type: 'subs',
      })

      if (!purchases) {
        throw new Error(t('error'))
      }

      if (Array.isArray(purchases)) {
        for (const purchase of purchases) {
          await finishTransaction({
            purchase,
          })
        }
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
  })

  return {
    isPending,
    subscribe: mutateAsync,
  }
}
