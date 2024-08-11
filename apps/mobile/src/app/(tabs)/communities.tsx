import { useLocalSearchParams } from 'expo-router'
import { z } from 'zod'

import { CommunitiesList } from '~/components/communities/list'
import { CommunitiesType } from '~/types/community'

const schema = z.object({
  type: z.enum(CommunitiesType).catch('communities'),
})

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  return <CommunitiesList type={params.type} />
}
