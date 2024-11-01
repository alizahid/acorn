import { type ReactNode, useRef } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import Swipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'
import { useSharedValue } from 'react-native-reanimated'

import { View } from '~/components/common/view'

import { Left } from './left'
import { Right } from './right'

export type GestureAction = 'upvote' | 'downvote' | 'save' | 'reply' | undefined

type Props = {
  children: ReactNode
  containerStyle?: StyleProp<ViewStyle>
  disabled?: boolean
  liked: boolean | null
  onAction: (action: GestureAction) => void
  radius?: 'small' | 'large'
  saved: boolean
  style?: StyleProp<ViewStyle>
}

export function PostGestures({
  children,
  containerStyle,
  disabled,
  liked,
  onAction,
  saved,
  style,
}: Props) {
  const swipeable = useRef<SwipeableMethods>(null)

  const action = useSharedValue<GestureAction>(undefined)

  if (disabled) {
    return <View style={[containerStyle, style]}>{children}</View>
  }

  return (
    <Swipeable
      childrenContainerStyle={style}
      containerStyle={containerStyle}
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
        <Left action={action} liked={liked} progress={progress} />
      )}
      renderRightActions={(progress) => (
        <Right action={action} progress={progress} saved={saved} />
      )}
      rightThreshold={Infinity}
    >
      {children}
    </Swipeable>
  )
}
