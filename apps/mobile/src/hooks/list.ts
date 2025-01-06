import { type FlashListProps } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useStyles } from 'react-native-unistyles'

type Padding =
  | number
  | {
      bottom?: number
      left?: number
      right?: number
      top?: number
    }
  | {
      horizontal?: number
      vertical?: number
    }

type Props = {
  bottom?: boolean | number
  header?: boolean
  padding?: Padding
  scroll?: boolean
  tabBar?: boolean
  top?: boolean | number
}

export type ListProps<Type = unknown> = Pick<
  FlashListProps<Type>,
  | 'contentContainerStyle'
  | 'keyboardDismissMode'
  | 'keyboardShouldPersistTaps'
  | 'progressViewOffset'
  | 'scrollIndicatorInsets'
>

export function useList<Type>({
  bottom = 0,
  header = true,
  padding,
  scroll = true,
  tabBar = true,
  top = 0,
}: Props = {}): ListProps<Type> {
  const insets = useSafeAreaInsets()

  const { theme } = useStyles()

  const offsets = {
    bottom:
      (tabBar
        ? insets.bottom + theme.space[4] + theme.space[5] + theme.space[4]
        : 0) + (typeof bottom === 'number' ? bottom : 0),
    top:
      (header ? insets.top + theme.space[8] : 0) +
      (typeof top === 'number' ? top : 0),
  }

  const paddingTop =
    padding &&
    (typeof padding === 'number'
      ? padding
      : 'vertical' in padding
        ? padding.vertical
        : 'top' in padding
          ? padding.top
          : 0)

  const paddingBottom =
    padding &&
    (typeof padding === 'number'
      ? padding
      : 'vertical' in padding
        ? padding.vertical
        : 'bottom' in padding
          ? padding.bottom
          : 0)

  const paddingLeft =
    padding &&
    (typeof padding === 'number'
      ? padding
      : 'horizontal' in padding
        ? padding.horizontal
        : 'left' in padding
          ? padding.left
          : 0)

  const paddingRight =
    padding &&
    (typeof padding === 'number'
      ? padding
      : 'horizontal' in padding
        ? padding.horizontal
        : 'right' in padding
          ? padding.right
          : 0)

  return {
    contentContainerStyle: {
      paddingBottom:
        offsets.bottom +
        (paddingBottom ?? 0) +
        (typeof bottom === 'boolean' ? insets.bottom : 0),
      paddingLeft,
      paddingRight,
      paddingTop:
        offsets.top +
        (paddingTop ?? 0) +
        (typeof top === 'boolean' ? insets.top : 0),
    },
    keyboardDismissMode: 'on-drag',
    keyboardShouldPersistTaps: 'handled',
    progressViewOffset: offsets.top,
    scrollIndicatorInsets: {
      bottom: offsets.bottom - (scroll ? insets.bottom : 0),
      right: 1,
      top: offsets.top - (scroll ? insets.top : 0),
    },
  }
}
