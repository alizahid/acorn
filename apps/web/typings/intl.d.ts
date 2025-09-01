import type en from '~/intl/en.json'

declare module 'next-intl' {
  // biome-ignore lint/nursery/useConsistentTypeDefinitions: go away
  interface AppConfig {
    Locale: 'en'
    Messages: typeof en
  }
}
