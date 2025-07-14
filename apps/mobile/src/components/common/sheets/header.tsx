import { type ReactNode } from 'react'
import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

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

export function SheetHeader({ left, right, style, title, titleStyle }: Props) {
  const { themeOled, themeTint } = usePreferences()

  const { styles } = useStyles(stylesheet)

  return (
    <View
      align="center"
      height="8"
      justify="center"
      style={[styles.main(themeOled, themeTint), style]}
    >
      {left ? <View style={[styles.left]}>{left}</View> : null}

      <Text style={titleStyle} weight="bold">
        {title}
      </Text>

      {right ? <View style={[styles.right]}>{right}</View> : null}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  left: {
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  main: (oled: boolean, tint: boolean) => ({
    backgroundColor: oled
      ? oledTheme[theme.name].bg
      : theme.colors[tint ? 'accent' : 'gray'].bgAlt,
  }),
  right: {
    bottom: 0,
    position: 'absolute',
    right: 0,
  },
}))
