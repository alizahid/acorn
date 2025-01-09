import { differenceInDays, differenceInHours } from 'date-fns'
import { useFormatter, useNow } from 'use-intl'

type Props = {
  children: Date
}

export function TimeAgo({ children }: Props) {
  const f = useFormatter()

  const days = differenceInDays(children, new Date())
  const hours = differenceInHours(children, new Date())

  const now = useNow({
    updateInterval:
      days > 30
        ? Infinity
        : days > 1
          ? 1_000 * 60 * 60 * 24
          : hours > 1
            ? 1_000 * 60 * 60
            : 1_000 * 60,
  })

  const time = f.relativeTime(children, {
    now,
    style: 'narrow',
  })

  if (time.endsWith('ago')) {
    return time.slice(0, -4)
  }

  return time
}
