import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { type ReactNode, type Ref } from 'react'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'

import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

import { SheetBackdrop } from './backdrop'
import { SheetHeader } from './header'

export type SheetModal = BottomSheetModal

type Props = {
  children: ReactNode
  container?: 'view' | 'scroll'
  onClose?: () => void
  ref?: Ref<SheetModal>
  right?: ReactNode
  title: string
}

export function SheetModal({
  children,
  container = 'view',
  onClose,
  ref,
  right,
  title,
}: Props) {
  const frame = useSafeAreaFrame()

  const { themeOled, themeTint } = usePreferences()

  styles.useVariants({
    iPad,
    oled: themeOled,
    tint: themeTint,
  })

  const Container =
    container === 'scroll' ? BottomSheetScrollView : BottomSheetView

  const props =
    container === 'scroll'
      ? {
          contentContainerStyle: styles.content,
        }
      : {
          style: styles.content,
        }

  return (
    <BottomSheetModal
      backdropComponent={SheetBackdrop}
      backgroundStyle={styles.background}
      handleComponent={null}
      maxDynamicContentSize={frame.height * 0.8}
      onDismiss={onClose}
      ref={ref}
      stackBehavior="push"
      style={styles.main}
    >
      <Container {...props}>
        <SheetHeader right={right} style={styles.header} title={title} />

        {children}
      </Container>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  background: {
    backgroundColor: theme.colors.gray.bg,
    variants: {
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bg,
        },
      },
      tint: {
        true: {
          backgroundColor: theme.colors.accent.bg,
        },
      },
    },
  },
  content: {
    paddingBottom: runtime.insets.bottom,
  },
  header: {
    backgroundColor: 'transparent',
  },
  main: {
    variants: {
      iPad: {
        true: {
          marginLeft: theme.space[6],
          maxWidth: 600,
        },
      },
    },
  },
}))
