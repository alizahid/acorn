import { useLocalSearchParams } from 'expo-router'
import { z } from 'zod'

import { UserAbout } from '~/components/users/about'
import { useList } from '~/hooks/list'

const schema = z.object({
  mode: z.literal('headless').optional(),
  name: z.string().catch('mildpanda'),
})

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const listProps = useList()

  return <UserAbout listProps={listProps} name={params.name} />
}
