import * as Application from 'expo-application'

export const REDIRECT_URI = 'acorn://login'
export const USER_AGENT = `ios:blue.acorn:v${Application.nativeApplicationVersion ?? '1.0.0'}`

export const REDDIT_URI = 'https://oauth.reddit.com'
export const REDDIT_SCOPES = [
  'history',
  'identity',
  'mysubreddits',
  'read',
  'report',
  'save',
  'submit',
  'subscribe',
  'vote',
].join(' ')
