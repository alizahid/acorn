import { useMutation } from '@tanstack/react-query'

import { getAccessToken, getAuthCode, type GetAuthCodeForm } from '~/lib/reddit'
import { useAuth } from '~/stores/auth'

export function useSignIn() {
  const { addAccount } = useAuth()

  const { isPending, mutateAsync } = useMutation<
    unknown,
    Error,
    GetAuthCodeForm
  >({
    async mutationFn(data) {
      const code = await getAuthCode(data)

      if (!code) {
        return null
      }

      const payload = await getAccessToken(data.clientId, code)

      if (payload) {
        addAccount(payload)
      }
    },
  })

  return {
    isPending,
    signIn: mutateAsync,
  }
}
