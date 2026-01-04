import { type MarginProps, type PaddingProps } from '~/styles/space'
import { type ViewStyleProps } from '~/styles/view'

import { Spinner } from './spinner'
import { View } from './view'

type Props = ViewStyleProps & MarginProps & PaddingProps

export function Loading(props: Props) {
  return (
    <View align="center" justify="center" my="9" {...props}>
      <Spinner size="large" />
    </View>
  )
}
