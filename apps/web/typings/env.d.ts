// biome-ignore lint/style/noNamespace: go away
declare namespace NodeJS {
  // biome-ignore lint/nursery/useConsistentTypeDefinitions: go away
  export interface ProcessEnv {
    REDDIT_CLIENT_ID: string
    REDDIT_CLIENT_SECRET: string
    REDDIT_REDIRECT_URL: string
  }
}
