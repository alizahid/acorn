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
import { scheduleOnRN } from 'react-native-worklets'

import { useStickyNav } from '~/hooks/sticky-nav'

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
  stickyNav?: boolean
}

export function SensorList<Type>({ stickyNav = true, ...props }: Props<Type>) {
  const height = useSharedValue(0)
  const offset = useSharedValue(0)

  const values = useRef<Map<string, number>>(new Map())

  const sticky = useStickyNav({
    disabled: !stickyNav,
  })

  const onScroll = useAnimatedScrollHandler((event) => {
    height.set(event.layoutMeasurement.height)
    offset.set(event.contentOffset.y)

    scheduleOnRN(sticky.onScroll, event.contentOffset.y)
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
