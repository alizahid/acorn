import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { tintDark, tintLight } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

import { Text } from '../common/text'
import { View } from '../common/view'
import { HeaderButton } from './header-button'

type Props = {
  back?: boolean
  children?: ReactNode
  left?: ReactNode
  modal?: boolean
  right?: ReactNode
  style?: StyleProp<ViewStyle>
  title?: ReactNode
}

export function Header({
  back,
  children,
  left,
  modal,
  right,
  style,
  title,
}: Props) {
  const router = useRouter()

  const { blurNavigation, themeBackground, themeOled } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const Main = modal ? View : blurNavigation ? BlurView : View

  return (
    <Main
      intensity={themeOled ? 25 : 75}
      style={[
        modal
          ? styles.modal(themeOled, themeBackground)
          : styles.main(blurNavigation, themeOled, themeBackground),
        style,
      ]}
      tint={theme.name === 'dark' ? tintDark : tintLight}
    >
      <View align="center" height="8" justify="center">
        {(left ?? back) ? (
          <View direction="row" style={[styles.actions, styles.left]}>
            {back ? (
              <HeaderButton
                icon={modal ? 'X' : 'ArrowLeft'}
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
    </Main>
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
  main: (blur: boolean, oled: boolean, bg: boolean) => ({
    backgroundColor: oled
      ? oledTheme[theme.name].bgAlpha
      : theme.colors[bg ? 'accent' : 'gray'][blur ? 'bgAlpha' : 'bg'],
    borderBottomColor: oled ? 'transparent' : theme.colors.gray.border,
    borderBottomWidth: runtime.hairlineWidth,
    left: 0,
    paddingTop: runtime.insets.top,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 100,
  }),
  modal: (oled: boolean, bg: boolean) => ({
    backgroundColor: oled
      ? oledTheme[theme.name].bg
      : theme.colors[bg ? 'accent' : 'gray'].bg,
    borderBottomColor: oled ? 'transparent' : theme.colors.gray.border,
    borderBottomWidth: runtime.hairlineWidth,
  }),
  right: {
    right: 0,
  },
  title: {
    maxWidth: '50%',
  },
}))
