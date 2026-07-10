import { useLocalSearchParams } from 'expo-router'
import { z } from 'zod'

import { CommunityAbout } from '~/components/communities/about'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  return <CommunityAbout name={params.name} />
}
