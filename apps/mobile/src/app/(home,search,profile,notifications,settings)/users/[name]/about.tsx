import { useLocalSearchParams } from 'expo-router'
import { useStyles } from 'react-native-unistyles'
import { z } from 'zod'

import { UserAbout } from '~/components/users/about'
import { useList } from '~/hooks/list'
import { iPad } from '~/lib/common'

const schema = z.object({
  mode: z.literal('headless').optional(),
  name: z.string().catch('mildpanda'),
})

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const { theme } = useStyles()

  const listProps = useList({
    padding: iPad ? theme.space[4] : 0,
  })

  return <UserAbout listProps={listProps} name={params.name} />
}
