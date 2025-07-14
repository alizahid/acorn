import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { type ReactNode } from 'react'
import { type ViewStyle } from 'react-native'
import {
  createStyleSheet,
  type UnistylesValues,
  useStyles,
} from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { tintDark, tintLight } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

import { IconButton } from '../common/icon-button'
import { Text } from '../common/text'
import { View } from '../common/view'

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

  const { styles, theme } = useStyles(stylesheet)

  const Component = blurNavigation ? BlurView : View

  return (
    <Component
      intensity={themeOled ? 25 : 75}
      style={
        styles.main(
          sticky,
          Boolean(modal),
          blurNavigation,
          themeOled,
          themeTint,
        ) as ViewStyle
      }
      tint={theme.name === 'dark' ? tintDark : tintLight}
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

const stylesheet = createStyleSheet((theme, runtime) => ({
  actions: {
    bottom: 0,
    position: 'absolute',
  },
  left: {
    left: 0,
  },
  main: (
    sticky: boolean,
    modal: boolean,
    blur: boolean,
    oled: boolean,
    tint: boolean,
  ) => {
    const base: UnistylesValues = {
      backgroundColor: oled
        ? oledTheme[theme.name].bgAlpha
        : theme.colors[tint ? 'accent' : 'gray'][blur ? 'bgAlpha' : 'bg'],
      borderBottomColor: oled ? 'transparent' : theme.colors.gray.border,
      borderBottomWidth: runtime.hairlineWidth,
    }

    if (modal) {
      return {
        ...base,
        backgroundColor: oled
          ? oledTheme[theme.name].bg
          : theme.colors[tint ? 'accent' : 'gray'].bg,
      }
    }

    if (sticky) {
      return {
        ...base,
        left: 0,
        paddingTop: runtime.insets.top,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 100,
      }
    }

    return {
      ...base,
      paddingTop: runtime.insets.top,
    }
  },
  right: {
    right: 0,
  },
  title: {
    maxWidth: '50%',
  },
}))
