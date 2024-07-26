import { useMutation } from '@tanstack/react-query'

import { getAccessToken, getAuthCode, type GetAuthCodeForm } from '~/lib/reddit'
import { useAuth } from '~/stores/auth'

export function useSignIn() {
  const { save } = useAuth()

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

      const token = await getAccessToken(data.clientId, code)

      if (token) {
        save(token)
      }
    },
  })

  return {
    isPending,
    signIn: mutateAsync,
  }
}
