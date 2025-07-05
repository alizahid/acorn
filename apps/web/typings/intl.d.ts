import type en from '~/intl/en.json'

declare module 'next-intl' {
  interface AppConfig {
    Locale: 'en'
    Messages: typeof en
  }
}
