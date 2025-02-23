import { type ReactNode, useRef } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import Swipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'
import { useSharedValue } from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { View } from '~/components/common/view'
import { iPhone } from '~/lib/common'

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
  liked: boolean | null
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
  onAction: (action: GestureAction | undefined) => void
  right: Gestures
  style?: StyleProp<ViewStyle>
}

export function PostGestures({
  children,
  containerStyle,
  data,
  left,
  onAction,
  right,
  style,
}: Props) {
  const frame = useSafeAreaFrame()

  const { styles } = useStyles(stylesheet)

  const swipeable = useRef<SwipeableMethods>(null)

  const action = useSharedValue<GestureAction | undefined>(undefined)

  if (!left.enabled && !right.enabled) {
    return <View style={[containerStyle, style]}>{children}</View>
  }

  return (
    <Swipeable
      childrenContainerStyle={style}
      containerStyle={containerStyle}
      dragOffsetFromLeftEdge={left.enabled ? 10 : frame.width}
      dragOffsetFromRightEdge={right.enabled ? 10 : frame.width}
      hitSlop={iPhone ? -24 : undefined}
      leftThreshold={Infinity}
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
      rightThreshold={Infinity}
    >
      {children}
    </Swipeable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
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
