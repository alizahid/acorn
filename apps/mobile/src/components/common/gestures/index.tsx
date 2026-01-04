import { type ReactNode } from 'react'
import { type ViewStyle } from 'react-native'

import { View } from '~/components/common/view'
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
  data: GestureData
  left: Gestures
  onAction: (action: Undefined<GestureAction>) => void
  right: Gestures
  style?: ViewStyle
}

export function Gestures({
  children,
  data,
  left,
  onAction,
  right,
  style,
}: Props) {
  if (!(left.enabled || right.enabled)) {
    return <View style={style}>{children}</View>
  }

  return (
    <Actions
      data={data}
      gestures={{
        left,
        right,
      }}
      onAction={onAction}
      style={style}
    >
      {children}
    </Actions>
  )
}
