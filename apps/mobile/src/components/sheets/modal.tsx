import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { forwardRef, type ReactNode } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { cardMaxWidth, iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

import { SheetBackdrop } from './backdrop'
import { SheetHeader } from './header'

type Props = {
  children: ReactNode
  container?: 'view' | 'scroll'
  right?: ReactNode
  title: string
}

export const SheetModal = forwardRef<BottomSheetModal, Props>(
  function Component({ children, container = 'view', right, title }, ref) {
    const { themeBackground, themeOled } = usePreferences()

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
        backgroundStyle={styles.background(themeOled, themeBackground)}
        handleComponent={null}
        maxDynamicContentSize={styles.maxHeight.height}
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
  },
)

const stylesheet = createStyleSheet((theme, runtime) => ({
  background: (oled: boolean, bg: boolean) => ({
    backgroundColor: oled
      ? oledTheme[theme.name].bg
      : theme.colors[bg ? 'accent' : 'gray'].bg,
    borderCurve: 'continuous',
    borderRadius: theme.radius[5],
  }),
  content: {
    paddingBottom: runtime.insets.bottom,
  },
  header: {
    borderCurve: 'continuous',
    borderTopLeftRadius: theme.radius[5],
    borderTopRightRadius: theme.radius[5],
  },
  main: {
    marginHorizontal: iPad
      ? (runtime.screen.width - cardMaxWidth) / 2
      : undefined,
  },
  maxHeight: {
    height: runtime.screen.height * 0.8,
  },
}))
