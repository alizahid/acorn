import { useMutation } from '@tanstack/react-query'
import { useUnistyles } from 'react-native-unistyles'

import { type AuthCodeForm, getAuthCode } from '~/reddit/auth-test-flight'
import { getAccessToken } from '~/reddit/token-test-flight'
import { useAuth } from '~/stores/auth'

export function useSignIn() {
  const { addAccount } = useAuth()

  const { theme } = useUnistyles()

  const { isPending, mutateAsync } = useMutation<boolean, Error, AuthCodeForm>({
    async mutationFn(data) {
      const code = await getAuthCode(data, {
        accent: theme.colors.accent.accent,
        background: theme.colors.gray.bg,
      })

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
