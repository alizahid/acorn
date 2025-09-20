import { ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet, withUnistyles } from 'react-native-unistyles'

import { getMargin, type MarginProps } from '~/styles/space'
import { type ColorToken, colors } from '~/styles/tokens'

const Indicator = withUnistyles(ActivityIndicator)

type Props = {
  color?: ColorToken | (string & {})
  contrast?: boolean
  size?: 'small' | 'large' | number
  style?: StyleProp<ViewStyle>
} & MarginProps

export const Spinner = withUnistyles(
  ({ color = 'accent', contrast, size = 'small', style, ...props }: Props) => (
    <Indicator
      size={size}
      style={[styles.main(props) as ViewStyle, style]}
      uniProps={(theme) => ({
        color: colors.includes(color as ColorToken)
          ? theme.colors[color as ColorToken][contrast ? 'contrast' : 'accent']
          : color,
      })}
    />
  ),
)

const styles = StyleSheet.create({
  main: getMargin,
})
