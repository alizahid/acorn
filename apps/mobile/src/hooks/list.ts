import { type FlashListProps } from '@shopify/flash-list'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useStyles } from 'react-native-unistyles'

type Props = {
  bottom?: number
  header?: boolean
  scroll?: boolean
  tabBar?: boolean
  top?: number
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
        : 0) + bottom,
    top: (header ? insets.top + theme.space[8] : 0) + top,
  }

  return {
    contentContainerStyle: {
      paddingBottom: offsets.bottom,
      paddingTop: offsets.top,
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
