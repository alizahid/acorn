import { useAuth } from '~/stores/auth'

import { REDDIT_URI, USER_AGENT } from './config'

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
  headers.set('user-agent', USER_AGENT)

  if (method === 'post') {
    headers.set('x-modhash', auth.modhash)
  }

  const request: RequestInit = {
    headers,
    method,
  }

  if (body) {
    request.body = body

    headers.set('content-type', 'multipart/form-data')
  }

  const input = new URL(url, REDDIT_URI)

  if (
    method === 'get' &&
    !input.pathname.startsWith('/api/') &&
    !input.pathname.endsWith('.json')
  ) {
    input.pathname += '.json'
  }

  input.searchParams.set('raw_json', '1')

  if (__DEV__) {
    console.log('reddit', input.toString(), request)
  }

  const response = await fetch(input, request)

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
  const { accountId, accounts } = useAuth.getState()

  if (!accountId) {
    return
  }

  const account = accounts.find((item) => item.id === accountId)

  if (!account) {
    return
  }

  return {
    cookie: account.cookie,
    modhash: account.modhash,
  }
}
