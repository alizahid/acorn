// biome-ignore lint/style/noNamespace: go away
declare namespace NodeJS {
  // biome-ignore lint/nursery/useConsistentTypeDefinitions: go away
  export interface ProcessEnv {
    EXPO_PUBLIC_TEST_FLIGHT: string
    EXPO_PUBLIC_WEB_URL: string
    SENTRY_AUTH_TOKEN: string
    SENTRY_ORG: string
    SENTRY_PROJECT: string
  }
}
