import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { useRef } from 'react'
import { useUnistyles } from 'react-native-unistyles'
import { toast } from 'sonner-native'

import { authenticate } from '~/reddit/auth-app-store'
import { useAuth } from '~/stores/auth'

export function useSignIn() {
  const router = useRouter()

  const { addAccount } = useAuth()

  const { theme } = useUnistyles()

  const id = useRef<string | number>(null)

  const { isPending, mutateAsync } = useMutation<boolean>({
    async mutationFn() {
      toast.dismiss(id.current ?? undefined)

      const payload = await authenticate({
        accent: theme.colors.accent.accent,
        background: theme.colors.gray.bg,
      })

      if (payload) {
        addAccount(payload)

        return true
      }

      return false
    },
    onError(error) {
      id.current = toast.error(error.message, {
        duration: Number.POSITIVE_INFINITY,
      })
    },
    onSuccess(data) {
      if (data) {
        router.dismiss()
      }
    },
  })

  return {
    isPending,
    signIn: mutateAsync,
  }
}
