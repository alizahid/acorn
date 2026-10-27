import {
  finishTransaction,
  initConnection,
  type Purchase,
  purchaseUpdatedListener,
} from 'expo-iap'
import { useEffect } from 'react'

import { verifyPurchase } from '~/lib/purchases'
import { queryClient } from '~/lib/query'
import { Sentry } from '~/lib/sentry'

export function PurchaseProvider() {
  useEffect(() => {
    const listener = purchaseUpdatedListener((purchase) => {
      handlePurchase(purchase).catch((error) => {
        Sentry.captureException(error)
      })
    })

    initConnection().catch((error) => {
      Sentry.captureException(error)
    })

    return () => {
      listener.remove()
    }
  }, [])

  return null
}

async function handlePurchase(purchase: Purchase) {
  if (await verifyPurchase(purchase)) {
    await finishTransaction({
      purchase,
    })
  }

  await queryClient.invalidateQueries({
    queryKey: ['purchases', 'subscribed'],
  })
}
