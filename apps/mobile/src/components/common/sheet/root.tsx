import { type SheetDetent, TrueSheet } from '@lodev09/react-native-true-sheet'
import { type ReactNode, type Ref } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'

import { glass } from '~/lib/common'

type Props = {
  children: ReactNode
  dismissible?: boolean
  detents?: Array<SheetDetent>
  onClose?: () => void
  ref?: Ref<TrueSheet>
}

export function Root({
  children,
  dismissible,
  onClose,
  detents = ['auto'],
  ref,
}: Props) {
  return (
    <TrueSheet
      backgroundBlur={glass ? undefined : 'system-chrome-material'}
      detents={detents}
      dismissible={dismissible}
      grabber={false}
      maxContentWidth={600}
      onWillDismiss={onClose}
      ref={ref}
    >
      <GestureHandlerRootView style={styles.content}>
        {children}
      </GestureHandlerRootView>
    </TrueSheet>
  )
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
})
