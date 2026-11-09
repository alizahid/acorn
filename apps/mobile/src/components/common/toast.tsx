import { type ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ToastMessage, {
  type ToastConfig,
  type ToastConfigParams,
} from 'react-native-toast-message'
import { StyleSheet } from 'react-native-unistyles'

import { glass, iPad, maxWidth } from '~/lib/common'
import { type ToastProps, type ToastType } from '~/lib/toast'
import { space } from '~/styles/tokens'

import { BlurView } from '../native/blur-view'
import { GlassView } from '../native/glass-view'
import { Icon } from './icon'
import { Spinner } from './spinner'
import { Text } from './text'

export function Toast() {
  const insets = useSafeAreaInsets()

  return <ToastMessage config={config} topOffset={insets.top} />
}

function Item({ props, text1, text2, type }: ToastConfigParams<ToastProps>) {
  const variants = styles.useVariants({
    iPad,
  })

  const Component = glass ? GlassView : BlurView

  return (
    <Component intensity={100} isInteractive style={variants.main}>
      <Pressable
        hitSlop={16}
        onPress={() => {
          ToastMessage.hide()
        }}
        style={styles.content}
      >
        {props.icon ?? icons[type as ToastType]}

        <View style={styles.label}>
          <Text allowFontScaling={false} weight="medium">
            {text1}
          </Text>

          {text2 ? (
            <Text allowFontScaling={false} highContrast={false} mt="1" size="2">
              {text2}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </Component>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  content: {
    flexDirection: 'row',
    gap: theme.space[2],
    padding: theme.space[3],
  },
  label: {
    flex: 1,
  },
  main: {
    borderColor: glass ? undefined : theme.colors.gray.border,
    borderCurve: 'continuous',
    borderRadius: theme.radius[5],
    borderWidth: glass ? undefined : 1,
    variants: {
      iPad: {
        false: {
          alignSelf: 'stretch',
          marginLeft: theme.space[4],
          marginRight: theme.space[4] + runtime.insets.right,
          marginTop: theme.space[4],
        },
        true: {
          alignSelf: 'center',
          maxWidth,
          width: '100%',
        },
      },
    },
  },
}))

const icons = {
  error: (
    <Icon
      allowFontScaling={false}
      name="warning-fill"
      uniProps={(theme) => ({
        color: theme.colors.red.accent,
      })}
    />
  ),
  loading: <Spinner size={space[5]} />,
  success: (
    <Icon
      allowFontScaling={false}
      name="check-circle-fill"
      uniProps={(theme) => ({
        color: theme.colors.green.accent,
      })}
    />
  ),
} as const satisfies Record<ToastType, ReactNode>

const config: ToastConfig = {
  error: (params) => <Item {...params} />,
  loading: (params) => <Item {...params} />,
  success: (params) => <Item {...params} />,
}
