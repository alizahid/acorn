import { TrueSheet } from '@lodev09/react-native-true-sheet'
import { type ReactNode, type Ref } from 'react'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

import { tintDark, tintLight } from '~/lib/common'

type Props = {
  children: ReactNode
  onClose?: () => void
  ref?: Ref<TrueSheet>
}

export function Root({ children, onClose, ref }: Props) {
  const { theme } = useUnistyles()

  return (
    <TrueSheet
      blurTint={theme.variant === 'dark' ? tintDark : tintLight}
      contentContainerStyle={styles.content}
      cornerRadius={theme.radius[6]}
      grabber={false}
      onDismiss={onClose}
      ref={ref}
      sizes={['auto']}
    >
      {children}
    </TrueSheet>
  )
}

const styles = StyleSheet.create((_theme, runtime) => ({
  content: {
    paddingBottom: runtime.insets.bottom,
  },
  header: {
    backgroundColor: 'transparent',
  },
}))
