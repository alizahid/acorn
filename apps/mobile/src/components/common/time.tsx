import { useFormatter, useNow } from 'use-intl'

type Props = {
  children: Date
  unit?: Intl.RelativeTimeFormatUnit
}

export function TimeAgo({ children, unit }: Props) {
  const f = useFormatter()

  const now = useNow({
    updateInterval: 1000 * 60,
  })

  const time = f.relativeTime(children, {
    now,
    style: 'narrow',
    unit,
  })

  if (time.endsWith('ago')) {
    return time.slice(0, -4)
  }

  return time
}
