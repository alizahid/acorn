import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { forwardRef, type ReactNode } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from '../common/text'
import { View } from '../common/view'
import { SheetBackdrop } from './backdrop'

type Props = {
  children: ReactNode
  container?: 'view' | 'scroll'
  right?: ReactNode
  title?: string
}

export const SheetModal = forwardRef<BottomSheetModal, Props>(
  function Component({ children, container = 'view', right, title }, ref) {
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
        backgroundStyle={styles.background}
        handleComponent={null}
        maxDynamicContentSize={styles.main.maxHeight}
        ref={ref}
        stackBehavior="push"
      >
        <Container {...props}>
          {(title ?? right) ? (
            <View align="center" height="8" justify="center">
              {title ? (
                <Text align="center" weight="bold">
                  {title}
                </Text>
              ) : null}

              {right ? <View style={styles.right}>{right}</View> : null}
            </View>
          ) : null}

          {children}
        </Container>
      </BottomSheetModal>
    )
  },
)

const stylesheet = createStyleSheet((theme, runtime) => ({
  background: {
    backgroundColor: theme.colors.gray[1],
    borderCurve: 'continuous',
    borderRadius: theme.radius[5],
  },
  content: {
    paddingBottom: runtime.insets.bottom,
  },
  main: {
    maxHeight: runtime.screen.height * 0.8,
  },
  right: {
    bottom: 0,
    position: 'absolute',
    right: 0,
  },
}))
