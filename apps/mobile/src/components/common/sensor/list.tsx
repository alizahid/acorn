import {
  FlashList,
  type FlashListProps,
  type FlashListRef,
} from '@shopify/flash-list'
import {
  createContext,
  type Ref,
  type RefObject,
  useContext,
  useRef,
} from 'react'
import Animated, {
  type SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'

// biome-ignore lint/suspicious/noExplicitAny: go away
const List = Animated.createAnimatedComponent(FlashList<any>)

const Context = createContext<{
  height: SharedValue<number>
  offset: SharedValue<number>
  values: RefObject<Map<string, number>>
  // @ts-expect-error
}>({})

type Props<Type> = FlashListProps<Type> & {
  ref?: Ref<FlashListRef<Type>>
}

export function SensorList<Type>(props: Props<Type>) {
  const height = useSharedValue(0)
  const offset = useSharedValue(0)

  const values = useRef<Map<string, number>>(new Map())

  const onScroll = useAnimatedScrollHandler((event) => {
    height.set(event.layoutMeasurement.height)
    offset.set(event.contentOffset.y)
  })

  return (
    <Context
      value={{
        height,
        offset,
        values,
      }}
    >
      <List {...props} onScroll={onScroll} scrollEventThrottle={100} />
    </Context>
  )
}

export function useSensor() {
  return useContext(Context)
}
