import { type ReactNode, useEffect, useRef } from 'react'
import { View } from 'react-native'

type Props = {
  children: ReactNode
  onChange: (visible: boolean) => void
  threshold?: number
}

export function InView({ children, onChange, threshold = 0.6 }: Props) {
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
  }, [threshold, onChange])

  return (
    <View collapsable={false} ref={ref}>
      {children}
    </View>
  )
}
