import { Spinner } from './spinner'
import { View } from './view'

export function Loading() {
  return (
    <View align="center" flexGrow={1} justify="center">
      <Spinner size="large" />
    </View>
  )
}
