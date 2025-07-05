import type en from '~/intl/en.json'

declare module 'use-intl' {
  interface AppConfig {
    Locale: 'en'
    Messages: typeof en
  }
}
