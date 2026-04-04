import {
  type CustomPressableProps,
  PressableOpacity,
  PressableWithoutFeedback,
} from 'pressto'

type Props = {
  disabled?: boolean
  variant?: 'opacity' | 'plain'
} & Omit<CustomPressableProps, 'enabled'>

export function Pressable({
  accessibilityRole = 'button',
  children,
  disabled = false,
  style,
  variant = 'opacity',
  ...props
}: Props) {
  const Main = variant === 'plain' ? PressableWithoutFeedback : PressableOpacity

  return (
    <Main
      {...props}
      accessibilityRole={accessibilityRole}
      enabled={!disabled}
      style={style}
    >
      {children}
    </Main>
  )
}
