import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from 'expo-iap'

export function usePlan() {
  const { isLoading, data } = useQuery({
    async queryFn() {
      const products = await fetchProducts({
        skus: ['monthly'],
        type: 'subs',
      })

      const product = products?.[0]

      if (!product) {
        return
      }

      if (product.platform === 'ios' && product.type === 'subs') {
        return product
      }
    },
    queryKey: ['purchases', 'plan'],
  })

  return {
    isLoading,
    plan: data,
  }
}
