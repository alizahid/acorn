import { ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native'
import { withUnistyles } from 'react-native-unistyles'

import { type ColorToken, colors } from '~/styles/tokens'

const Indicator = withUnistyles(ActivityIndicator)

type Props = {
  color?: ColorToken | (string & {})
  contrast?: boolean
  size?: 'small' | 'large' | number
  style?: StyleProp<ViewStyle>
}

export const Spinner = withUnistyles(
  ({ color = 'accent', contrast, size = 'small', style }: Props) => (
    <Indicator
      size={size}
      style={style}
      uniProps={(theme) => ({
        color: colors.includes(color as ColorToken)
          ? theme.colors[color as ColorToken][contrast ? 'contrast' : 'accent']
          : color,
      })}
    />
  ),
)
