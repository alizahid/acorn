import { type ReactNode, useRef } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import Swipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'
import { useSharedValue } from 'react-native-reanimated'
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
  | undefined

export type GestureData = {
  hidden?: boolean
  liked: boolean | null
  saved: boolean
}

export type Gestures = {
  leftLong: NonNullable<GestureAction>
  leftShort: NonNullable<GestureAction>
  rightLong: NonNullable<GestureAction>
  rightShort: NonNullable<GestureAction>
}

type Props = {
  children: ReactNode
  containerStyle?: StyleProp<ViewStyle>
  data: GestureData
  disabled?: boolean
  gestures: Gestures
  onAction: (action: GestureAction) => void
  style?: StyleProp<ViewStyle>
}

export function PostGestures({
  children,
  containerStyle,
  data,
  disabled,
  gestures,
  onAction,
  style,
}: Props) {
  const { styles } = useStyles(stylesheet)

  const swipeable = useRef<SwipeableMethods>(null)

  const action = useSharedValue<GestureAction>(undefined)

  if (disabled) {
    return <View style={[containerStyle, style]}>{children}</View>
  }

  return (
    <Swipeable
      childrenContainerStyle={style}
      containerStyle={containerStyle}
      hitSlop={
        iPhone
          ? {
              left: -24,
              right: -12,
            }
          : undefined
      }
      leftThreshold={Infinity}
      onSwipeableWillClose={() => {
        const next = action.get()

        onAction(next)
      }}
      onSwipeableWillOpen={() => {
        swipeable.current?.close()
      }}
      ref={swipeable}
      renderLeftActions={(progress) => (
        <Actions
          action={action}
          data={data}
          long={gestures.leftLong}
          progress={progress}
          short={gestures.leftShort}
          style={styles.left}
        />
      )}
      renderRightActions={(progress) => (
        <Actions
          action={action}
          data={data}
          long={gestures.rightLong}
          progress={progress}
          short={gestures.rightShort}
          style={styles.right}
        />
      )}
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
