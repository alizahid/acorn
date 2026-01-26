import { isEqual, maxBy } from 'lodash'
import { type ReactNode, useRef } from 'react'
import Animated, { useAnimatedReaction } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { useDebouncedCallback } from 'use-debounce'

import { useSensor } from '~/components/common/sensor/list'

type OnChangePayload = {
  full: boolean
  visible: boolean
}

type Props = {
  children: ReactNode
  id?: string
  onChange: (payload: OnChangePayload) => void
}

export function VisibilitySensor({ children, id, onChange }: Props) {
  const sensor = useSensor()

  const ref = useRef<Animated.View>(null)

  const previous = useRef<OnChangePayload>(null)

  const measure = useDebouncedCallback(() => {
    const windowHeight = sensor.height.get()

    ref.current?.measure((_x, _y, _width, height, _pageX, pageY) => {
      const box = {
        bottom: pageY + height,
        height,
        top: pageY,
      }

      const visible = box.top <= windowHeight && box.bottom >= 0

      const percent = getPercent({
        box,
        height: windowHeight,
        visible,
      })

      if (id) {
        if (visible) {
          sensor.values.current.set(id, percent)
        } else {
          sensor.values.current.delete(id)
        }
      }

      const next: OnChangePayload = {
        full:
          !!id &&
          visible &&
          id ===
            maxBy(
              Array.from(sensor.values.current.entries()),
              (item) => item[1],
            )?.[0],
        visible,
      }

      if (!isEqual(next, previous.current)) {
        onChange(next)

        previous.current = next
      }
    })
  }, 250)

  useAnimatedReaction(
    () => sensor.offset.get(),
    () => {
      scheduleOnRN(measure)
    },
  )

  return (
    <Animated.View
      onLayout={() => {
        measure()
      }}
      ref={ref}
    >
      {children}
    </Animated.View>
  )
}

function getPercent({
  box,
  height,
  visible,
}: {
  box: {
    bottom: number
    height: number
    top: number
  }
  height: number
  visible: boolean
}) {
  if (!visible) {
    return 0
  }

  return Math.round(
    (Math.max(0, Math.min(height, box.bottom) - Math.max(0, box.top)) /
      box.height) *
      100,
  )
}
