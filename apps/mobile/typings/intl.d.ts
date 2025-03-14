import type en from '~/intl/en.json'

declare module 'use-intl' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- go away
  interface AppConfig {
    Locale: 'en'
    Messages: typeof en
  }
}
