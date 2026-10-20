import { Touchable, type TouchableProps } from 'react-native-gesture-handler'

type Props = {
  variant?: 'opacity' | 'plain'
} & TouchableProps

export function Pressable({
  accessibilityRole = 'button',
  children,
  style,
  variant = 'opacity',
  ...props
}: Props) {
  return (
    <Touchable
      {...props}
      accessibilityRole={accessibilityRole}
      activeOpacity={variant === 'opacity' ? 0.5 : props.activeOpacity}
      animationDuration={variant === 'opacity' ? 150 : props.animationDuration}
      style={style}
    >
      {children}
    </Touchable>
  )
}
