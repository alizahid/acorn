import { useMutation } from '@tanstack/react-query'

import { getAccessToken, getAuthCode, type GetAuthCodeForm } from '~/lib/reddit'
import { type AuthPayload } from '~/stores/auth'

type Data = Required<AuthPayload> | null

type Props = {
  onSuccess?: (data: Data) => void
}

export function useSignIn({ onSuccess }: Props) {
  const { isPending, mutate } = useMutation<Data, Error, GetAuthCodeForm>({
    async mutationFn(data) {
      const code = await getAuthCode(data)

      if (!code) {
        return null
      }

      return getAccessToken(data.clientId, code)
    },
    onSuccess(data) {
      onSuccess?.(data)
    },
  })

  return {
    isPending,
    signIn: mutate,
  }
}
