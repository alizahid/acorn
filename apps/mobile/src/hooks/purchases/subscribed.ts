import { useQuery } from '@tanstack/react-query'
import { isTestFlight } from 'expo-testflight'

import { purchases } from '~/lib/purchases'
import { authStore } from '~/stores/auth'

export function useSubscribed() {
  const { isLoading, data } = useQuery({
    async queryFn() {
      if (__DEV__ || isTestFlight) {
        return true
      }

      if (authStore.getState().accounts.length > 0) {
        return true
      }

      const offerings = await purchases.getOfferings()

      const item = offerings.current?.availablePackages[0]

      if (!item) {
        return false
      }

      const customer = await purchases.getCustomerInfo()

      return customer.activeSubscriptions.includes(item.product.identifier)
    },
    queryKey: ['purchases', 'subscribed'],
  })

  return {
    isLoading,
    subscribed: data,
  }
}
