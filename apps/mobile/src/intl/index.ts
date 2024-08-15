import { getCalendars } from 'expo-localization'
import {
  createFormatter,
  createTranslator,
  type NamespaceKeys,
  type NestedKeyOf,
} from 'use-intl'

import messages from './en.json'

const [calendar] = getCalendars()

export function getTranslator(
  namespace?: NamespaceKeys<IntlMessages, NestedKeyOf<IntlMessages>>,
) {
  return createTranslator({
    locale: 'en',
    messages,
    namespace,
    now: new Date(),
    timeZone: calendar?.timeZone ?? undefined,
  })
}

export function getFormatter() {
  return createFormatter({
    locale: 'en',
    now: new Date(),
    timeZone: calendar?.timeZone ?? undefined,
  })
}
