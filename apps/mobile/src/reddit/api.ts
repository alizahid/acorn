import { getUserAgent } from '~/lib/user-agent'
import { authStore } from '~/stores/auth'

export const REDDIT_URI = 'https://www.reddit.com'
export const REDDIT_OLD_URI = 'https://old.reddit.com'

type Props = {
  body?: FormData
  method?: 'get' | 'post'
  url: string | URL
}

export async function reddit<Response>({ body, method = 'get', url }: Props) {
  const auth = getAuth()

  if (!auth) {
    return
  }

  const headers = new Headers()

  headers.set('cookie', `reddit_session=${auth.cookie}`)
  headers.set('user-agent', getUserAgent())

  if (method === 'post') {
    headers.set('x-modhash', auth.modHash)
  }

  const request: RequestInit = {
    headers,
    method,
    redirect: 'follow',
  }

  if (body) {
    request.body = body

    headers.set('content-type', 'multipart/form-data')
  }

  const uri = new URL(url, REDDIT_URI)

  if (
    method === 'get' &&
    !uri.pathname.startsWith('/api/') &&
    !uri.pathname.endsWith('.json')
  ) {
    uri.pathname += '.json'
  }

  uri.searchParams.set('raw_json', '1')

  if (__DEV__) {
    console.log('url', uri.toString())
  }

  const response = await fetch(uri, request)

  if (url === '/api/read_all_messages') {
    return {} as Response
  }

  if (response.status >= 400) {
    const json = (await response.json()) as {
      explanation?: string
      message?: string
    }

    throw new Error(json.explanation ?? json.message ?? response.statusText)
  }

  return (await response.json()) as Response
}

function getAuth() {
  const { accountId, accounts } = authStore.getState()

  if (!accountId) {
    return
  }

  const account = accounts.find((item) => item.id === accountId)

  if (!account) {
    return
  }

  return {
    cookie: account.cookie,
    modHash: account.modHash,
  }
}
