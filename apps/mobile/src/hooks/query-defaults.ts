import { useEffect } from 'react'

import { queryClient } from '~/lib/query'
import { Sentry } from '~/lib/sentry'
import { usePreferences } from '~/stores/preferences'

export function useQueryDefaults() {
  const { refreshInterval } = usePreferences()

  useEffect(() => {
    queryClient.setDefaultOptions({
      dehydrate: {
        shouldDehydrateQuery(query) {
          const first = String(query.queryKey[0])

          return /communities|feeds|inbox|unread/.test(first)
        },
      },
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
        gcTime: refreshInterval * 60 * 1_000,
        retry: false,
        staleTime: refreshInterval * 60 * 1_000,
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
