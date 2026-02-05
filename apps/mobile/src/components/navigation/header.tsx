import { usePathname, useRouter } from 'expo-router'
import { type ReactNode, useEffect } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useStageManager } from '~/hooks/stage-manager'
import { tints } from '~/lib/common'
import { mitter } from '~/lib/mitt'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

import { IconButton } from '../common/icon/button'
import { Text } from '../common/text'
import { View } from '../common/view'
import { BlurView } from '../native/blur-view'

export type HeaderProps = {
  back?: boolean
  children?: ReactNode
  left?: ReactNode
  modal?: boolean
  right?: ReactNode
  sticky?: boolean
  title?: ReactNode
}

export function Header({
  back,
  children,
  left,
  modal,
  right,
  sticky = true,
  title,
}: HeaderProps) {
  const router = useRouter()
  const path = usePathname()

  const a11y = useTranslations('a11y')

  const { blurNavigation, themeOled, themeTint } = usePreferences()

  const stageManager = useStageManager()

  styles.useVariants({
    blur: blurNavigation,
    modal: Boolean(modal),
    oled: themeOled,
    stageManager,
    sticky,
    tint: themeTint,
  })

  const height = useSharedValue(0)
  const translate = useSharedValue<`${number}%` | number>(0)

  useEffect(() => {
    function onShow() {
      translate.set(withTiming(0))
    }

    function onHide() {
      translate.set(withTiming(-height.get()))
    }

    mitter.on('show-header', onShow)
    mitter.on('hide-header', onHide)

    return () => {
      mitter.off('show-header', onShow)
      mitter.off('hide-header', onHide)
    }
  }, [translate, height])

  // biome-ignore lint/correctness/useExhaustiveDependencies: go away
  useEffect(() => {
    translate.set(withTiming(0))
  }, [path, translate.set])

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translate.get(),
      },
    ],
    zIndex: 1,
  }))

  const Component = blurNavigation ? BlurView : View

  return (
    <Animated.View style={style}>
      <Component
        intensity={themeOled ? 25 : 75}
        onLayout={(event) => {
          height.set(event.nativeEvent.layout.height)
        }}
        style={styles.main}
        uniProps={(theme) => ({
          tint: tints[theme.variant],
        })}
      >
        <View align="center" height="8" justify="center">
          {(left ?? back) ? (
            <View style={[styles.actions, styles.left]}>
              {back ? (
                <IconButton
                  icon={modal ? 'xmark' : 'arrow.left'}
                  label={a11y(modal ? 'close' : 'goBack')}
                  onPress={() => {
                    router.back()
                  }}
                  weight="bold"
                />
              ) : null}

              {left}
            </View>
          ) : null}

          {typeof title === 'string' ? (
            <Text numberOfLines={1} style={styles.title} weight="bold">
              {title}
            </Text>
          ) : (
            <View direction="row" gap="2">
              {title}
            </View>
          )}

          {right ? (
            <View style={[styles.actions, styles.right]}>{right}</View>
          ) : null}
        </View>

        {children}
      </Component>
    </Animated.View>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  actions: {
    bottom: 0,
    flexDirection: 'row',
    position: 'absolute',
  },
  left: {
    left: 0,
    variants: {
      stageManager: {
        true: {
          left: 68,
        },
      },
    },
  },
  main: {
    backgroundColor: theme.colors.gray.bg,
    borderBottomColor: theme.colors.gray.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    compoundVariants: [
      {
        modal: false,
        sticky: false,
        styles: {
          paddingTop: runtime.insets.top,
        },
      },
      {
        modal: true,
        oled: true,
        styles: {
          backgroundColor: oledTheme[theme.variant].bg,
        },
      },
      {
        modal: true,
        styles: {
          backgroundColor: theme.colors.accent.bg,
        },
        tint: true,
      },
      {
        blur: true,
        styles: {
          backgroundColor: theme.colors.accent.bgAlpha,
        },
        tint: true,
      },
    ],
    variants: {
      blur: {
        true: {
          backgroundColor: theme.colors.gray.bgAlpha,
        },
      },
      modal: {
        true: {
          backgroundColor: theme.colors.gray.bg,
          paddingTop: theme.space[4],
        },
      },
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bgAlpha,
          borderBottomColor: 'transparent',
        },
      },
      sticky: {
        true: {
          left: 0,
          paddingTop: runtime.insets.top,
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: 100,
        },
      },
      tint: {
        true: {
          backgroundColor: theme.colors.accent.bg,
        },
      },
    },
  },
  right: {
    right: 0,
  },
  title: {
    maxWidth: '50%',
  },
}))
