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
  const Main = variant === 'plain' ? PressableWithoutFeedback : PressableOpacity

  return (
    <Main {...props} accessibilityRole={accessibilityRole} style={style}>
      {children}
    </Main>
  )
}
