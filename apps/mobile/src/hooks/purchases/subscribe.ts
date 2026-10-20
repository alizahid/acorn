import { useMutation } from '@tanstack/react-query'
import {
  finishTransaction,
  isUserCancelledError,
  requestPurchase,
} from 'expo-iap'
import { useRouter } from 'expo-router'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

type Variables = {
  planId: string
  type: 'in-app' | 'subs'
}

export function useSubscribe() {
  const router = useRouter()

  const t = useTranslations('hook.purchases.subscribe')

  const { isPending, mutateAsync } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables, context) {
      try {
        const purchases = await requestPurchase({
          request: {
            apple: {
              sku: variables.planId,
            },
          },
          type: variables.type,
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
      } finally {
        await context.client.invalidateQueries({
          queryKey: ['purchases', 'subscribed'],
        })
      }
    },
    onError(error) {
      if (!isUserCancelledError(error)) {
        toast.error(error.message)
      }
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
