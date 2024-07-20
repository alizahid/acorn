import { ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import { type ColorName } from '~/styles/colors'

type Props = {
  color?: ColorName
  contrast?: boolean
  size?: 'small' | 'large'
  style?: StyleProp<ViewStyle>
}

export function Spinner({
  color = 'accent',
  contrast,
  size = 'small',
  style,
}: Props) {
  const { theme } = useStyles()

  return (
    <ActivityIndicator
      color={theme.colors[color][contrast ? 'contrast' : 9]}
      size={size}
      style={style}
    />
  )
}
