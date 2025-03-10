import { useMutation } from '@tanstack/react-query'
import { useStyles } from 'react-native-unistyles'

import { type AuthCodeForm, getAuthCode } from '~/reddit/auth'
import { getAccessToken } from '~/reddit/token'
import { useAuth } from '~/stores/auth'

export function useSignIn() {
  const { addAccount } = useAuth()

  const { theme } = useStyles()

  const { isPending, mutateAsync } = useMutation<boolean, Error, AuthCodeForm>({
    async mutationFn(data) {
      const code = await getAuthCode(data, theme)

      if (!code) {
        return false
      }

      const payload = await getAccessToken(data.clientId, code)

      if (payload) {
        addAccount(payload)

        return true
      }

      return false
    },
  })

  return {
    isPending,
    signIn: mutateAsync,
  }
}
