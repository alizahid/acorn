import { ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { getMargin, type MarginProps } from '~/styles/space'
import { type ColorToken, ColorTokens } from '~/styles/tokens'

type Props = {
  color?: ColorToken | (string & {})
  contrast?: boolean
  size?: 'small' | 'large' | number
  style?: StyleProp<ViewStyle>
} & MarginProps

export function Spinner({
  color = 'accent',
  contrast,
  size = 'small',
  style,
  ...props
}: Props) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <ActivityIndicator
      color={
        ColorTokens.includes(color as ColorToken)
          ? theme.colors[color as ColorToken][contrast ? 'contrast' : 'accent']
          : color
      }
      size={size}
      style={[styles.main(props) as ViewStyle, style]}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: getMargin(theme),
}))
