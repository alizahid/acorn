import { Spinner } from './spinner'
import { View } from './view'

export function Loading() {
  return (
    <View align="center" justify="center" my="9">
      <Spinner size="large" />
    </View>
  )
}
