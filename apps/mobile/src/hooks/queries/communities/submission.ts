import { useQuery } from '@tanstack/react-query'

import { reddit } from '~/reddit/api'
import {
  SubmissionCommunitySchema,
  SubmissionFlairSchema,
  SubmissionRequirementsSchema,
} from '~/schemas/submission'
import { useAuth } from '~/stores/auth'
import { transformSubmission } from '~/transformers/submission'

export function useSubmission(name: string) {
  const { accountId } = useAuth()

  const { data, isLoading, refetch } = useQuery({
    enabled: Boolean(accountId),

    async queryFn() {
      const community = SubmissionCommunitySchema.parse(
        await reddit({
          url: `/r/${name}/about`,
        }),
      )

      const requirements = SubmissionRequirementsSchema.parse(
        await reddit({
          url: `/api/v1/${name}/post_requirements`,
        }),
      )

      const flair = await fetchFlair(name)

      return transformSubmission({
        community,
        flair,
        requirements,
      })
    },
    queryKey: [
      'submission',
      {
        name,
      },
    ],
  })

  return {
    isLoading,
    refetch,
    submission: data,
  }
}

async function fetchFlair(name: string) {
  try {
    return SubmissionFlairSchema.parse(
      await reddit({
        url: `/r/${name}/api/link_flair_v2`,
      }),
    )
  } catch {
    return []
  }
}
