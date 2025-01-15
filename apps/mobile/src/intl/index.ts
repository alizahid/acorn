import { getCalendars } from 'expo-localization'

const [calendar] = getCalendars()

export const timeZone =
  (calendar?.timeZone === 'Asia/Kolkata'
    ? 'Asia/Calcutta'
    : calendar?.timeZone) ?? undefined
