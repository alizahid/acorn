import { range } from 'lodash'
import { type ReactNode, type RefObject, useEffect, useRef } from 'react'
import { View } from 'react-native'

type Props = {
  children: ReactNode
  onChange: (visible: boolean) => void
  threshold?: number
}

export function InView({ children, onChange, threshold = 0.6 }: Props) {
  const ref = useRef<View>(null)

  const callback = useRef(onChange)

  useEffect(() => {
    callback.current = onChange
  })

  useEffect(() => {
    const candidate: Candidate = {
      onChange: callback,
      ratio: 0,
    }

    candidates.add(candidate)

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry?.intersectionRatio ?? 0

        candidate.ratio = ratio >= threshold ? ratio : 0

        elect()
      },
      {
        threshold: range(21).map((step) => step / 20),
      },
    )

    if (ref.current) {
      observer.observe(ref.current as unknown as Element)
    }

    return () => {
      observer.disconnect()

      candidates.delete(candidate)

      elect()
    }
  }, [threshold])

  return (
    <View collapsable={false} ref={ref}>
      {children}
    </View>
  )
}

type Candidate = {
  onChange: RefObject<Props['onChange']>
  ratio: number
}

const candidates = new Set<Candidate>()

let winner: Candidate | undefined

function elect() {
  let next: Candidate | undefined

  for (const candidate of candidates) {
    if (
      candidate.ratio > (next?.ratio ?? 0) ||
      (candidate.ratio === next?.ratio && candidate === winner)
    ) {
      next = candidate
    }
  }

  if (next !== winner) {
    winner?.onChange.current(false)
    next?.onChange.current(true)

    winner = next
  }
}
