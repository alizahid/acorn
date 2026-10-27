import { useMutation } from '@tanstack/react-query'
import {
  finishTransaction,
  isUserCancelledError,
  requestPurchase,
} from 'expo-iap'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { verifyPurchase } from '~/lib/purchases'

type Variables = {
  planId: string
  type: 'in-app' | 'subs'
}

export function useSubscribe() {
  const t = useTranslations('hook.purchases.subscribe')

  const { isPending, mutateAsync } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables, context) {
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

      await Promise.all(
        [purchases].flat().map(async (purchase) => {
          if (!(await verifyPurchase(purchase))) {
            throw new Error(t('error'))
          }

          await finishTransaction({
            purchase,
          })
        }),
      )

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
    subscribe: mutateAsync,
  }
}
