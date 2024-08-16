import { type ReactNode } from 'react'
import {
  Modal as ReactNativeModal,
  ScrollView,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useCommon } from '~/hooks/common'

import { Pressable } from './pressable'
import { Text } from './text'
import { View } from './view'

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
      <View flexGrow={1} justify="center" p="6">
        <Pressable
          flexGrow={1}
          onPress={() => {
            onClose()
          }}
          style={styles.overlay}
          without
        />

        <View style={styles.content(common.frame.height)}>
          <View
            align="center"
            direction="row"
            height="8"
            justify="center"
            style={styles.header}
          >
            {left ? (
              <View direction="row" style={[styles.actions, styles.left]}>
                {left}
              </View>
            ) : null}

            {title ? <Text weight="bold">{title}</Text> : null}

            {right ? (
              <View direction="row" style={[styles.actions, styles.right]}>
                {right}
              </View>
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
    position: 'absolute',
    top: 0,
  },
  content: (frameHeight: number) => ({
    backgroundColor: theme.colors.gray[1],
    borderCurve: 'continuous',
    borderRadius: theme.radius[6],
    maxHeight: frameHeight * 0.6,
    overflow: 'hidden',
  }),
  header: {
    backgroundColor: theme.colors.gray.a2,
  },
  left: {
    left: 0,
  },
  modal: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.gray.a9,
    position: 'absolute',
  },
  right: {
    right: 0,
  },
}))
