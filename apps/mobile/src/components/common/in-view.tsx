import { type ReactNode, useEffect, useRef } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'

type Props = {
  children: ReactNode
  onChange: (visible: boolean) => void
  style?: StyleProp<ViewStyle>
  threshold?: number
}

export function InView({ children, onChange, style, threshold = 0.6 }: Props) {
  const ref = useRef<View>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        onChange(entry?.isIntersecting ?? false)
      },
      {
        threshold,
      },
    )

    if (ref.current) {
      observer.observe(ref.current as unknown as Element)
    }

    return () => {
      observer.disconnect()
    }
  }, [onChange, threshold])

  return (
    <View collapsable={false} ref={ref} style={style}>
      {children}
    </View>
  )
}
