import { useQuery } from '@tanstack/react-query'

import { purchases } from '~/lib/purchases'

export function usePlan() {
  const { isLoading, data } = useQuery({
    async queryFn() {
      const offerings = await purchases.getOfferings()

      return offerings.current?.availablePackages[0]
    },
    queryKey: ['purchases', 'plan'],
  })

  return {
    isLoading,
    plan: data,
  }
}
