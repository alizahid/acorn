import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { type ReactNode, type Ref } from 'react'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

import { SheetBackdrop } from './backdrop'
import { SheetHeader } from './header'

type Props = {
  children: ReactNode
  container?: 'view' | 'scroll'
  onClose?: () => void
  ref?: Ref<BottomSheetModal>
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

  const { styles } = useStyles(stylesheet)

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
      backgroundStyle={styles.background(themeOled, themeTint)}
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

const stylesheet = createStyleSheet((theme, runtime) => ({
  background: (oled: boolean, tint: boolean) => ({
    backgroundColor: oled
      ? oledTheme[theme.name].bg
      : theme.colors[tint ? 'accent' : 'gray'].bg,
  }),
  content: {
    paddingBottom: runtime.insets.bottom,
  },
  header: {
    backgroundColor: 'transparent',
  },
  main: {
    marginLeft: iPad ? theme.space[6] : undefined,
    maxWidth: iPad ? 600 : undefined,
  },
}))
