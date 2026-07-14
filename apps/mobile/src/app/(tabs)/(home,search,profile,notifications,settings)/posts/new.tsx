import { useLocalSearchParams } from 'expo-router'
import { z } from 'zod'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { Submission } from '~/components/submission'
import { useSubmission } from '~/hooks/queries/communities/submission'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const { isLoading, error, submission } = useSubmission(params.name)

  if (isLoading) {
    return <Loading />
  }

  if (error || !submission) {
    return <Empty message={error?.message} />
  }

  return <Submission submission={submission} />
}
