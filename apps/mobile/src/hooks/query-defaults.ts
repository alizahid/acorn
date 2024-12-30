import { useEffect } from 'react'

import { queryClient } from '~/lib/query'
import { Sentry } from '~/lib/sentry'
import { usePreferences } from '~/stores/preferences'

export function useQueryDefaults() {
  const { refreshInterval } = usePreferences()

  useEffect(() => {
    queryClient.setDefaultOptions({
      mutations: {
        throwOnError(error) {
          if (__DEV__) {
            // eslint-disable-next-line no-console -- dev
            console.log(error)
          }

          Sentry.captureException(error)

          return false
        },
      },
      queries: {
        gcTime: refreshInterval * 1_000 * 60,
        retry: false,
        staleTime: refreshInterval * 1_000 * 60,
        throwOnError(error) {
          if (__DEV__) {
            // eslint-disable-next-line no-console -- dev
            console.log(error)
          }

          Sentry.captureException(error)

          return false
        },
      },
    })
  }, [refreshInterval])
}
