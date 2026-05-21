import { type ComponentProps } from 'react'
import { ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native'
import { withUnistyles } from 'react-native-unistyles'

import { type ColorToken, colors } from '~/styles/tokens'

const Indicator = withUnistyles(ActivityIndicator)

type Props = {
  color?: ColorToken | (string & {})
  contrast?: boolean
  size?: 'small' | 'large' | number
  style?: StyleProp<ViewStyle>
} & Pick<ComponentProps<typeof Indicator>, 'uniProps'>

export function Spinner({
  color = 'accent',
  contrast,
  size = 'small',
  style,
  uniProps,
}: Props) {
  return (
    <Indicator
      size={size}
      style={style}
      uniProps={(theme, runtime) => ({
        color: colors.includes(color as ColorToken)
          ? theme.colors[color as ColorToken][contrast ? 'contrast' : 'accent']
          : color,
        ...uniProps?.(theme, runtime),
      })}
    />
  )
}
