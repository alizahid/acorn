import { useLocalSearchParams } from 'expo-router'
import { z } from 'zod'

import { UserAbout } from '~/components/users/about'

const schema = z.object({
  name: z.string().catch('mildpanda'),
})

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  return <UserAbout name={params.name} />
}
