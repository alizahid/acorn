// biome-ignore lint/performance/noNamespaceImport: go away
import * as Updates from 'expo-updates'

export const REDIRECT_URI = 'acorn://login'
export const USER_AGENT = `ios:blue.acorn:v${Updates.runtimeVersion ?? '1.0.0'}`

export const REDDIT_URI = 'https://oauth.reddit.com'
export const REDDIT_SCOPES = [
  'edit',
  'flair',
  'history',
  'identity',
  'mysubreddits',
  'privatemessages',
  'read',
  'report',
  'save',
  'submit',
  'subscribe',
  'vote',
  'wikiedit',
  'wikiread',
].join(' ')
