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
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HeaderButton } from '../navigation/header-button'
import { Text } from './text'

type Props = {
  children: ReactNode
  onClose: () => void
  style?: StyleProp<ViewStyle>
  title?: string
  visible?: boolean
}

export function Modal({ children, onClose, style, title, visible }: Props) {
  const frame = useSafeAreaFrame()

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

        <View style={styles.content(frame.height)}>
          <View style={styles.header}>
            {title ? <Text weight="bold">{title}</Text> : null}

            <HeaderButton
              icon="X"
              onPress={() => {
                onClose()
              }}
              style={styles.close}
              weight="bold"
            />
          </View>

          <ScrollView contentContainerStyle={style}>{children}</ScrollView>
        </View>
      </View>
    </ReactNativeModal>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  close: {
    position: 'absolute',
    right: 0,
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
}))
