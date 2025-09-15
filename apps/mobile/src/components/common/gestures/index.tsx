import { type ReactNode, useRef } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import Swipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'
import { useSharedValue } from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'

import { View } from '~/components/common/view'
import { iPhone } from '~/lib/common'
import { type Nullable, type Undefined } from '~/types'

import { Actions } from './actions'

export type GestureAction =
  | 'upvote'
  | 'downvote'
  | 'save'
  | 'reply'
  | 'share'
  | 'hide'

export type GestureData = {
  hidden?: boolean
  liked: Nullable<boolean>
  saved: boolean
}

export type Gestures = {
  enabled: boolean
  long: GestureAction
  short: GestureAction
}

type Props = {
  children: ReactNode
  containerStyle?: StyleProp<ViewStyle>
  data: GestureData
  left: Gestures
  onAction: (action: Undefined<GestureAction>) => void
  right: Gestures
  style?: StyleProp<ViewStyle>
}

export function Gestures({
  children,
  containerStyle,
  data,
  left,
  onAction,
  right,
  style,
}: Props) {
  const frame = useSafeAreaFrame()

  const swipeable = useRef<SwipeableMethods>(null)

  const action = useSharedValue<Undefined<GestureAction>>(undefined)

  if (!(left.enabled || right.enabled)) {
    return <View style={[containerStyle, style]}>{children}</View>
  }

  return (
    <Swipeable
      childrenContainerStyle={style}
      containerStyle={containerStyle}
      dragOffsetFromLeftEdge={left.enabled ? 12 : frame.width}
      dragOffsetFromRightEdge={right.enabled ? 12 : frame.width}
      hitSlop={
        iPhone
          ? {
              left: -24,
            }
          : undefined
      }
      leftThreshold={Number.POSITIVE_INFINITY}
      onSwipeableWillClose={() => {
        const next = action.get()

        onAction(next)
      }}
      onSwipeableWillOpen={() => {
        swipeable.current?.close()
      }}
      ref={swipeable}
      renderLeftActions={(progress) =>
        left.enabled ? (
          <Actions
            action={action}
            data={data}
            long={left.long}
            progress={progress}
            short={left.short}
            style={styles.left}
          />
        ) : null
      }
      renderRightActions={(progress) =>
        right.enabled ? (
          <Actions
            action={action}
            data={data}
            long={right.long}
            progress={progress}
            short={right.short}
            style={styles.right}
          />
        ) : null
      }
      rightThreshold={Number.POSITIVE_INFINITY}
    >
      {children}
    </Swipeable>
  )
}

const styles = StyleSheet.create((theme) => ({
  left: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: theme.space[4],
    width: '90%',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: theme.space[4],
    width: '90%',
  },
}))
