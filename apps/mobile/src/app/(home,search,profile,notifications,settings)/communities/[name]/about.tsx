import { useLocalSearchParams } from 'expo-router'
import { useStyles } from 'react-native-unistyles'
import { z } from 'zod'

import { CommunityAbout } from '~/components/communities/about'
import { useList } from '~/hooks/list'
import { iPad } from '~/lib/common'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const { theme } = useStyles()

  const listProps = useList({
    padding: iPad ? theme.space[4] : 0,
  })

  return <CommunityAbout listProps={listProps} name={params.name} />
}
