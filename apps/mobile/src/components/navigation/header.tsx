import { useRouter } from 'expo-router'
import { type ReactNode } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { tintDark, tintLight } from '~/lib/common'
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

  const a11y = useTranslations('a11y')

  const { blurNavigation, themeOled, themeTint } = usePreferences()

  styles.useVariants({
    blur: blurNavigation,
    modal: Boolean(modal),
    oled: themeOled,
    sticky,
    tint: themeTint,
  })

  const Component = blurNavigation ? BlurView : View

  return (
    <Component
      intensity={themeOled ? 25 : 75}
      style={styles.main}
      uniProps={(theme) => ({
        tint: theme.variant === 'dark' ? tintDark : tintLight,
      })}
    >
      <View align="center" height="8" justify="center">
        {(left ?? back) ? (
          <View direction="row" style={[styles.actions, styles.left]}>
            {back ? (
              <IconButton
                icon={{
                  name: modal ? 'X' : 'ArrowLeft',
                  weight: 'bold',
                }}
                label={a11y(modal ? 'close' : 'goBack')}
                onPress={() => {
                  router.back()
                }}
              />
            ) : null}

            {left}
          </View>
        ) : null}

        {typeof title === 'string' ? (
          <Text lines={1} style={styles.title} weight="bold">
            {title}
          </Text>
        ) : (
          <View direction="row" gap="2">
            {title}
          </View>
        )}

        {right ? (
          <View direction="row" style={[styles.actions, styles.right]}>
            {right}
          </View>
        ) : null}
      </View>

      {children}
    </Component>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  actions: {
    bottom: 0,
    position: 'absolute',
  },
  left: {
    left: 0,
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
