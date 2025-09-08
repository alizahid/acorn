import { type ReactNode } from 'react'
import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

type Props = {
  left?: ReactNode
  right?: ReactNode
  style?: StyleProp<ViewStyle>
  title: string
  titleStyle?: StyleProp<TextStyle>
}

export function ListHeader({ left, right, style, title, titleStyle }: Props) {
  const { themeOled, themeTint } = usePreferences()

  styles.useVariants({
    oled: themeOled,
    tint: themeTint,
  })

  return (
    <View
      align="center"
      height="8"
      justify="center"
      style={[styles.main, style]}
    >
      {left ? <View style={styles.left}>{left}</View> : null}

      <Text style={titleStyle} weight="bold">
        {title}
      </Text>

      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  left: {
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  main: {
    backgroundColor: theme.colors.gray.bgAlt,
    variants: {
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bg,
        },
      },
      tint: {
        true: {
          backgroundColor: theme.colors.accent.bgAlt,
        },
      },
    },
  },
  right: {
    bottom: 0,
    position: 'absolute',
    right: 0,
  },
}))
