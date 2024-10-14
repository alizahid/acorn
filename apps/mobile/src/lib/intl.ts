import { tz } from '@date-fns/tz'
import { fromUnixTime } from 'date-fns'
import { getCalendars } from 'expo-localization'

export function withoutAgo(time: string) {
  if (time.endsWith(' ago')) {
    return time.slice(0, -4)
  }

  return time
}

const [calendar] = getCalendars()

export function dateFromUnix(timestamp: number) {
  return fromUnixTime(timestamp, {
    in: calendar?.timeZone ? tz(calendar.timeZone) : undefined,
  })
}
