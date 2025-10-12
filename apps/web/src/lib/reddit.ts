export const REDDIT_URL = 'https://www.reddit.com'
export const REDDIT_OAUTH_URL = 'https://oauth.reddit.com'
export const USER_AGENT = 'ios:blue.acorn'

export const REDIRECT_URI = 'acorn://login'
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

export function getAuth() {
  return `Basic ${Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64')}`
}

export async function getId(accessToken: string) {
  const url = new URL('/api/v1/me', REDDIT_OAUTH_URL)

  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      'user-agent': USER_AGENT,
    },
  })

  const json = (await response.json()) as
    | {
        name: string
      }
    | undefined

  return json?.name
}
