import {
  type CustomPressableProps,
  PressableOpacity,
  PressableWithoutFeedback,
} from 'pressto'

type Props = {
  variant?: 'opacity' | 'plain'
} & CustomPressableProps

export function Pressable({
  accessibilityRole = 'button',
  children,
  style,
  variant = 'opacity',
  ...props
}: Props) {
  const Component =
    variant === 'plain' ? PressableWithoutFeedback : PressableOpacity

  return (
    <Component {...props} accessibilityRole={accessibilityRole} style={style}>
      {children}
    </Component>
  )
}
