import { type ReactNode } from 'react'
import {
  Modal as ReactNativeModal,
  Pressable,
  ScrollView,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useCommon } from '~/hooks/common'

import { Text } from './text'

type Props = {
  children: ReactNode
  left?: ReactNode
  onClose: () => void
  right?: ReactNode
  style?: StyleProp<ViewStyle>
  title?: string
  visible?: boolean
}

export function Modal({
  children,
  left,
  onClose,
  right,
  style,
  title,
  visible,
}: Props) {
  const common = useCommon()

  const { styles } = useStyles(stylesheet)

  return (
    <ReactNativeModal
      animationType="fade"
      style={styles.modal}
      transparent
      visible={visible}
    >
      <View style={styles.main}>
        <Pressable
          onPress={() => {
            onClose()
          }}
          style={styles.overlay}
        />

        <View style={styles.content(common.frame.height)}>
          <View style={styles.header}>
            {left ? (
              <View style={[styles.actions, styles.left]}>{left}</View>
            ) : null}

            {title ? <Text weight="bold">{title}</Text> : null}

            {right ? (
              <View style={[styles.actions, styles.right]}>{right}</View>
            ) : null}
          </View>

          <ScrollView contentContainerStyle={style}>{children}</ScrollView>
        </View>
      </View>
    </ReactNativeModal>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  actions: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
  },
  content: (frameHeight: number) => ({
    backgroundColor: theme.colors.gray[1],
    borderRadius: theme.radius[6],
    maxHeight: frameHeight * 0.6,
    overflow: 'hidden',
  }),
  header: {
    alignItems: 'center',
    backgroundColor: theme.colors.gray.a2,
    flexDirection: 'row',
    height: theme.space[8],
    justifyContent: 'center',
  },
  left: {
    left: 0,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.space[6],
  },
  modal: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.gray.a9,
    flex: 1,
    position: 'absolute',
  },
  right: {
    right: 0,
  },
}))
