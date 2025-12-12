import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { type ReactNode, type Ref } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

type Props = {
  children: ReactNode
  onClose?: () => void
  ref?: Ref<TrueSheet>
}

export function Root({ children, onClose, ref }: Props) {
  const { theme } = useUnistyles()

  return (
    <TrueSheet
      blurTint={theme.variant}
      cornerRadius={theme.radius[6]}
      detents={['auto']}
      grabber={false}
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
