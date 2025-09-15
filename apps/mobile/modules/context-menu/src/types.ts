import { type SFSymbol } from 'expo-symbols'
import { type ReactNode, type Ref } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'

export type OnPressEventPayload = {
  id: string
}

export type ContextMenuState = 'on' | 'off' | 'mixed'

export type ContextMenuAction = {
  color?: string
  destructive?: boolean
  disabled?: boolean
  icon?: SFSymbol
  id: string
  inline?: boolean
  onPress?: () => void
  options?: Array<ContextMenuAction>
  state?: ContextMenuState
  title: string
}

export type ContextMenuRef = {
  hide: () => void
}

export type ContextMenuProps = {
  accessibilityLabel: string
  children: ReactNode
  onPressPreview?: () => void
  options?: Array<ContextMenuAction>
  ref?: Ref<ContextMenuRef>
  style?: StyleProp<ViewStyle>
  tappable?: boolean
  title?: string
}
