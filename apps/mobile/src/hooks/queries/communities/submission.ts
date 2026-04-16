import { useQuery } from '@tanstack/react-query'

import { reddit } from '~/reddit/api'
import {
  SubmissionCommunitySchema,
  SubmissionFlairSchema,
} from '~/schemas/submission'
import { useAuth } from '~/stores/auth'
import { transformSubmission } from '~/transformers/submission'

export function useSubmission(name: string) {
  const accountId = useAuth((state) => state.accountId)

  const { data, error, isLoading, refetch } = useQuery({
    enabled: Boolean(accountId),
    networkMode: 'offlineFirst',
    async queryFn() {
      const [community, flair] = await Promise.all([
        SubmissionCommunitySchema.parse(
          await reddit({
            url: `/r/${name}/about`,
          }),
        ),
        fetchFlair(name),
      ])

      return transformSubmission({
        community,
        flair,
      })
    },
    queryKey: [
      'submission',
      {
        name,
      },
    ],
    retry: false,
  })

  return {
    error,
    isLoading,
    refetch,
    submission: data,
  }
}

async function fetchFlair(name: string) {
  try {
    return SubmissionFlairSchema.parse(
      await reddit({
        url: `/r/${name}/api/link_flair_v2.json`,
      }),
    )
  } catch {
    return []
  }
}
