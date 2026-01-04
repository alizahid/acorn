import { useQuery } from '@tanstack/react-query'

import { purchases } from '~/lib/purchases'

export function useSubscribed() {
  const { isLoading, data } = useQuery({
    networkMode: 'offlineFirst',
    async queryFn() {
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
