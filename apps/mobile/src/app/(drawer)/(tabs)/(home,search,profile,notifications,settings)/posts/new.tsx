import { useLocalSearchParams } from 'expo-router'
import { z } from 'zod'

import { Loading } from '~/components/common/loading'
import { Submission } from '~/components/submission'
import { useSubmission } from '~/hooks/queries/communities/submission'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const { isLoading, submission } = useSubmission(params.name)

  if (!submission || isLoading) {
    return <Loading />
  }

  return <Submission submission={submission} />
}
