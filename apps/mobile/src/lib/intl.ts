import { tz } from '@date-fns/tz'
import { fromUnixTime } from 'date-fns'

import { timeZone } from '~/intl'

export function withoutAgo(time: string) {
  if (time.endsWith(' ago')) {
    return time.slice(0, -4)
  }

  return time
}

export function dateFromUnix(timestamp: number) {
  return fromUnixTime(timestamp, {
    in: timeZone ? tz(timeZone) : undefined,
  })
}
