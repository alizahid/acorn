import { ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type ColorToken } from '~/styles/colors'
import { getMargin, type MarginProps } from '~/styles/space'

type Props = {
  color?: ColorToken
  contrast?: boolean
  size?: 'small' | 'large'
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
      color={theme.colors[color][contrast ? 'contrast' : 'a9']}
      size={size}
      style={[styles.main(props) as ViewStyle, style]}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: getMargin(theme),
}))
