import { type SheetDetent, TrueSheet } from '@lodev09/react-native-true-sheet'
import { type ReactNode, type Ref } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { glass } from '~/lib/common'

type Props = {
  children: ReactNode
  detents?: Array<SheetDetent>
  dismissible?: boolean
  onClose?: () => void
  ref?: Ref<TrueSheet>
  scrollable?: boolean
}

export function Root({
  children,
  detents = ['auto'],
  dismissible,
  onClose,
  ref,
  scrollable,
}: Props) {
  const { theme } = useUnistyles()

  return (
    <TrueSheet
      backgroundBlur={
        glass
          ? undefined
          : theme.variant === 'dark'
            ? 'system-chrome-material-dark'
            : 'system-chrome-material-light'
      }
      cornerRadius={glass ? undefined : styles.main.borderRadius}
      detents={detents}
      dismissible={dismissible}
      grabber={false}
      insetAdjustment="never"
      maxContentWidth={600}
      onWillDismiss={onClose}
      ref={ref}
      scrollable={scrollable}
    >
      <GestureHandlerRootView style={styles.content}>
        {children}
      </GestureHandlerRootView>
    </TrueSheet>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    flexGrow: 1,
    paddingHorizontal: glass ? StyleSheet.hairlineWidth : undefined,
  },
  main: {
    borderRadius: theme.radius[6],
  },
}))
