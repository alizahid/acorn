import { useFormatter, useNow } from 'use-intl'

type Props = {
  children: Date
}

export function TimeAgo({ children }: Props) {
  const f = useFormatter()

  const now = useNow({
    updateInterval: 1_000 * 60,
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
