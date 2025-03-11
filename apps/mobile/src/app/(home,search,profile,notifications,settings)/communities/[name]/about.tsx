import { useLocalSearchParams } from 'expo-router'
import { z } from 'zod'

import { CommunityAbout } from '~/components/communities/about'
import { useList } from '~/hooks/list'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const listProps = useList()

  return <CommunityAbout listProps={listProps} name={params.name} />
}
