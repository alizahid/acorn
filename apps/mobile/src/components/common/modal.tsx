import { type ReactNode, useEffect } from 'react'
import {
  Modal as ReactNativeModal,
  ScrollView,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

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
  const { styles } = useStyles(stylesheet)

  const opacity = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }))

  useEffect(() => {
    opacity.set(() => withTiming(visible ? 1 : 0))
  }, [opacity, visible])

  return (
    <ReactNativeModal transparent visible={visible}>
      <Animated.View style={[styles.main, animatedStyle]}>
        <Pressable
          flexGrow={1}
          onPress={() => {
            opacity.set(() =>
              withTiming(0, undefined, () => {
                runOnJS(onClose)()
              }),
            )
          }}
          style={styles.overlay}
        />

        <View style={styles.content}>
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
      </Animated.View>
    </ReactNativeModal>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  actions: {
    position: 'absolute',
    top: 0,
  },
  content: {
    alignSelf: 'center',
    backgroundColor: theme.colors.gray[1],
    borderCurve: 'continuous',
    borderRadius: theme.radius[6],
    maxHeight: runtime.screen.height * 0.6,
    maxWidth: 400,
    overflow: 'hidden',
    width: '100%',
  },
  header: {
    backgroundColor: theme.colors.gray.a2,
  },
  left: {
    left: 0,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.space[6],
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
