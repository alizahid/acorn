import { useMutation, useQuery } from '@tanstack/react-query'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as SecureStore from 'expo-secure-store'

export const CLIENT_ID_KEY = 'client-id'

type Variables = {
  clientId: string | null
}

export function useClientId() {
  const { data, isLoading } = useQuery({
    queryFn() {
      return SecureStore.getItemAsync(CLIENT_ID_KEY)
    },
    queryKey: ['auth', 'clientId'],
  })

  const { isPending, mutateAsync } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables, context) {
      if (variables.clientId) {
        await SecureStore.setItemAsync(CLIENT_ID_KEY, variables.clientId)
      } else {
        await SecureStore.deleteItemAsync(CLIENT_ID_KEY)
      }

      await context.client.invalidateQueries({
        queryKey: ['auth', 'clientId'],
      })
    },
  })

  return {
    clientId: data,
    isLoading,
    isPending,
    updateClientId: mutateAsync,
  }
}
